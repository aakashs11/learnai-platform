"""
Pipeline Processor
SOLID: Single Responsibility - Orchestrates pipeline steps
Dependency Inversion - Uses existing extractors/enrichers
"""
import logging
import os
import json
import sys

# Import existing pipeline components
sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'pipeline'))

from pdf_extractor import PDFExtractor
from enrich_content import enrich_content

logger = logging.getLogger('processor')


class PipelineProcessor:
    """
    Orchestrates the PDF processing pipeline.
    SOLID: Open/Closed - Add new steps without modifying existing ones.
    """
    
    def __init__(self, output_dir: str = None, assets_dir: str = None):
        base_dir = os.path.dirname(__file__)
        self.output_dir = output_dir or os.path.join(base_dir, '..', 'pipeline', 'output')
        self.assets_dir = assets_dir or os.path.join(base_dir, '..', 'pipeline', 'assets')
        
    def run(self, pdf_path: str, progress_callback=None) -> dict:
        """
        Run the full pipeline: Extract -> Enrich -> Return
        
        Args:
            pdf_path: Path to uploaded PDF
            progress_callback: Function(progress: int, message: str) for updates
        
        Returns:
            dict: Enriched content JSON
        """
        def log_progress(progress: int, message: str):
            logger.info(f"[{progress}%] {message}")
            if progress_callback:
                progress_callback(progress, message)
        
        # Step 1: Extract PDF (0-50%)
        log_progress(10, "Starting PDF extraction...")
        
        extractor = PDFExtractor(output_dir=self.output_dir, assets_dir=self.assets_dir)
        md_file = extractor.extract(pdf_path)
        
        log_progress(50, "PDF extraction complete. Starting enrichment...")
        
        # Step 2: Enrich content (50-90%)
        log_progress(60, "Enriching content with AI...")
        
        json_file = enrich_content(md_file)
        
        if not json_file or not os.path.exists(json_file):
            raise Exception("Enrichment failed - no output file created")
        
        log_progress(90, "Loading enriched content...")
        
        # Step 3: Load and return result
        with open(json_file, 'r', encoding='utf-8') as f:
            result = json.load(f)
        
        log_progress(100, "Processing complete!")
        
        return result


if __name__ == "__main__":
    # Test the processor directly
    import sys
    if len(sys.argv) > 1:
        processor = PipelineProcessor()
        result = processor.run(sys.argv[1])
        print(json.dumps(result, indent=2))
    else:
        print("Usage: python processor.py <pdf_path>")
