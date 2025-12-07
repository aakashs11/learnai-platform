import fitz  # PyMuPDF
import os
import io
from PIL import Image

class PDFExtractor:
    def __init__(self, output_dir="output", assets_dir="assets"):
        self.output_dir = output_dir
        self.assets_dir = assets_dir
        
        # Create directories if they don't exist
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(self.assets_dir, exist_ok=True)

    def extract(self, pdf_path, max_pages=None):
        """
        Extracts text and images from a PDF, preserving reading order.
        """
        doc = fitz.open(pdf_path)
        full_content = []
        
        pdf_name = os.path.splitext(os.path.basename(pdf_path))[0]
        # Create a specific folder for this PDF's assets
        pdf_assets_dir = os.path.join(self.assets_dir, pdf_name)
        os.makedirs(pdf_assets_dir, exist_ok=True)

        print(f"Processing: {pdf_path}")
        print(f"Total Pages: {len(doc)}")
        
        # Limit pages if specified
        pages_to_process = min(len(doc), max_pages) if max_pages else len(doc)
        for page_num in range(pages_to_process):
            page = doc.load_page(page_num)
            print(f" Scanning Page {page_num + 1}...")
            
            # 1. Get Text Blocks
            # content: (x0, y0, x1, y1, text, block_no, block_type)
            # block_type=0 is text, =1 is image
            blocks = page.get_text("blocks")
            
            # 2. Get Images and their coordinates
            # We use get_images to find the images, then use their xref to find rects
            image_list = page.get_images(full=True)
            
            mixed_blocks = []
            
            # Add text blocks to mixed_list
            for b in blocks:
                if b[6] == 0: # Text block
                    mixed_blocks.append({
                        "type": "text",
                        "bbox": fitz.Rect(b[:4]),
                        "content": b[4],
                        "y0": b[1]
                    })

            # Add image blocks
            for img_index, img in enumerate(image_list):
                xref = img[0]
                # An image can appear multiple times on a page (e.g. watermark), so we get a list of rects
                rects = page.get_image_rects(xref)
                
                for rect in rects:
                    # Extract and save image
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    ext = base_image["ext"]
                    image_filename = f"img_p{page_num + 1}_{img_index}.{ext}"
                    image_path = os.path.join(pdf_assets_dir, image_filename)
                    
                    with open(image_path, "wb") as f:
                        f.write(image_bytes)
                        
                    mixed_blocks.append({
                        "type": "image",
                        "bbox": rect,
                        "content": f"![Image](assets/{pdf_name}/{image_filename})",
                        "y0": rect.y0,
                        "path": image_path
                    })

            # 3. Sort by vertical position (y0)
            # Threshold to group things on same line? 
            # For now, simple sort by y0 is usually sufficient for single column
            mixed_blocks.sort(key=lambda b: b["y0"])

            # 4. Generate Page Output
            page_content = [f"\n\n## Page {page_num + 1}\n"]
            for block in mixed_blocks:
                content = block["content"].strip()
                if content:
                    page_content.append(content)
            
            full_content.append("\n".join(page_content))

        # Save Markdown
        output_file = os.path.join(self.output_dir, f"{pdf_name}_extracted.md")
        with open(output_file, "w", encoding="utf-8") as f:
            f.write("\n".join(full_content))
            
        print(f"Extraction complete. Saved to {output_file}")
        return output_file

if __name__ == "__main__":
    # Test with a PDF if it exists
    # You can verify this by placing a 'handbook.pdf' in pipeline/data
    import sys
    
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
    else:
        # Default placeholder
        pdf_path = "pipeline/data/handbook.pdf"
        
    if os.path.exists(pdf_path):
        extractor = PDFExtractor(output_dir="pipeline/output", assets_dir="pipeline/assets")
        extractor.extract(pdf_path, max_pages=5)
    else:
        print(f"PDF not found at {pdf_path}. Please place a PDF there to test.")
