from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import os
import httpx
import logging

# Configure lightweight logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('api-vercel')

app = FastAPI(title="LearnAI API Proxy")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Secure this in production if needed
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "platform": "vercel"}

# Simple In-Memory Rate Limiter
# Note: For production with multiple Vercel instances, use Vercel KV or Edge Middleware.
# This prevents basic abuse from a single instance/cold-start.
request_counts = {}

def check_rate_limit(client_ip: str, limit: int = 10, window: int = 60):
    import time
    current_time = time.time()
    
    # Clean up old requests
    if client_ip in request_counts:
        request_counts[client_ip] = [t for t in request_counts[client_ip] if t > current_time - window]
    else:
        request_counts[client_ip] = []
    
    # Check limit
    if len(request_counts[client_ip]) >= limit:
        return False
    
    # Add new request
    request_counts[client_ip].append(current_time)
    return True

@app.post("/api/chat")
async def chat_proxy(request: Request):
    """
    Proxy requests to OpenAI to hide the API Key from the frontend.
    Includes Rate Limiting: 10 req/min per IP.
    """
    client_ip = request.client.host or "unknown"
    
    if not check_rate_limit(client_ip):
        logger.warning(f"Rate limit exceeded for IP: {client_ip}")
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again later.")

    try:
        body = await request.json()
        
        # Get Key from Env
        api_key = os.environ.get("VITE_OPENAI_API_KEY") or os.environ.get("OPENAI_API_KEY")
        
        if not api_key:
            logger.error("Missing OpenAI API Key in environment")
            raise HTTPException(status_code=500, detail="Server Configuration Error: Missing API Key")
            
        # Forward request to OpenAI
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}"
                },
                json=body,
                timeout=60.0
            )
            
            if response.status_code != 200:
                logger.error(f"OpenAI Error: {response.text}")
                raise HTTPException(status_code=response.status_code, detail="AI Provider Error")
                
            return response.json()

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Proxy Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Expose 'app' for Vercel
# Vercel looks for a global 'app' variable in the defined entrypoint
