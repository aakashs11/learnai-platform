"""
PDF Pipeline API Server
SOLID Principles Applied:
- Single Responsibility: Each endpoint does ONE thing
- Open/Closed: Extendable via processor module
- Dependency Inversion: Uses processor abstraction, not direct script calls
"""
import logging
import uuid
import os
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import sys

# Add pipeline to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'pipeline'))

from processor import PipelineProcessor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [%(levelname)s] %(name)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('api')

app = FastAPI(title="PDF Pipeline API", version="1.0.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://learnwithaakash.in"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory job storage (SOLID: Keep it simple, upgrade to Redis if needed)
jobs: Dict[str, dict] = {}

# Ensure uploads directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/api/upload")
async def upload_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    Upload PDF and start processing.
    Returns job_id for status polling.
    """
    if not file.filename.endswith('.pdf'):
        logger.warning(f"Rejected non-PDF file: {file.filename}")
        raise HTTPException(status_code=400, detail="Only PDF files accepted")
    
    job_id = str(uuid.uuid4())[:8]
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")
    
    # Save uploaded file
    logger.info(f"[{job_id}] Saving uploaded file: {file.filename}")
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    # Initialize job status
    jobs[job_id] = {
        "status": "queued",
        "progress": 0,
        "message": "File uploaded, processing starting...",
        "file_path": file_path,
        "result": None
    }
    
    # Start background processing
    background_tasks.add_task(process_pdf_task, job_id, file_path)
    logger.info(f"[{job_id}] Job queued for processing")
    
    return {"job_id": job_id, "status": "queued"}


@app.get("/api/jobs/{job_id}")
async def get_job_status(job_id: str):
    """Check processing status and progress."""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    return {
        "job_id": job_id,
        "status": job["status"],
        "progress": job["progress"],
        "message": job["message"]
    }


@app.get("/api/jobs/{job_id}/result")
async def get_job_result(job_id: str):
    """Get processed content (only when complete)."""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    if job["status"] != "complete":
        raise HTTPException(status_code=400, detail=f"Job not complete: {job['status']}")
    
    return {"job_id": job_id, "result": job["result"]}


def process_pdf_task(job_id: str, file_path: str):
    """
    Background task to run the pipeline.
    Updates job status as it progresses.
    """
    logger.info(f"[{job_id}] Starting pipeline processing")
    
    def update_progress(progress: int, message: str):
        jobs[job_id]["progress"] = progress
        jobs[job_id]["message"] = message
        logger.info(f"[{job_id}] Progress: {progress}% - {message}")
    
    try:
        jobs[job_id]["status"] = "processing"
        
        processor = PipelineProcessor()
        result = processor.run(file_path, progress_callback=update_progress)
        
        jobs[job_id]["status"] = "complete"
        jobs[job_id]["progress"] = 100
        jobs[job_id]["message"] = "Processing complete!"
        jobs[job_id]["result"] = result
        logger.info(f"[{job_id}] Pipeline complete!")
        
    except Exception as e:
        logger.error(f"[{job_id}] Pipeline failed: {e}")
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["message"] = str(e)


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting PDF Pipeline API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
