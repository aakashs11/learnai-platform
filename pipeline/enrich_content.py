import os
import json
import re
from openai import OpenAI
from dotenv import load_dotenv

# Load env variables (assuming .env.local in ui folder)
load_dotenv('ui/.env.local')

client = OpenAI(api_key=os.getenv('VITE_OPENAI_API_KEY'))

SYSTEM_PROMPT = """
You are a strict data structuring assistant. Your goal is to convert raw educational content into structured JSON with **High Fidelity** to the original source text.

INPUT FORMAT:
Markdown text containing headers, paragraphs, lists, and image tags.

OUTPUT FORMAT:
Return ONLY valid JSON matching this schema:
{
  "title": "Lesson Title",
  "objectives": ["obj1", "obj2"],
  "contentBlocks": [
    {
      "type": "concept",
      "title": "Section Title",
      "content": "The actual text from the PDF...",
      "image": "path/to/img.png",
      "keyTakeaway": "One sentence summary (generated)"
    }
  ],
  "quiz": { ... }
}

CRITICAL RULES:
1. **PRESERVE TEXT:** Do NOT simplify, summarize, or "dumb down" the content. The academic tone and specific terminology of the CBSE syllabus must be maintained perfectly.
2. **PRESERVE IMAGES:** If you see `![Image](path)`, YOU MUST include that path in the relevant block.
3. **NO HALLUCINATIONS:** Do not add external facts. Use only the provided text.
4. **STRUCTURE:** Split long text into logical `concept` blocks for readability, but ensure the core message is untouched.
"""

def enrich_content(md_file_path):
    print(f"Enriching content from: {md_file_path}")
    
    with open(md_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # For cost/speed, let's limit context if it's huge, but for this demo we assume reasonable size
    # In production, we'd chunk this.
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Convert this lesson content:\n\n{content}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        
        result_json = response.choices[0].message.content
        parsed_json = json.loads(result_json)
        
        # Save output
        output_path = md_file_path.replace('_extracted.md', '_enriched.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(parsed_json, f, indent=2)
            
        print(f"Enrichment complete! Saved to {output_path}")
        return output_path
        
    except Exception as e:
        print(f"Error during enrichment: {e}")
        return None

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        enrich_content(sys.argv[1])
    else:
        # Default test
        enrich_content("pipeline/output/test_lesson_extracted.md")
