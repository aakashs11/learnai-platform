from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
import os

def create_test_pdf(filename="pipeline/data/test_lesson.pdf"):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    # Page 1
    c.setFont("Helvetica-Bold", 24)
    c.drawString(inch, height - inch, "Chapter 1: Neural Networks")
    
    c.setFont("Helvetica", 12)
    text = "Neural networks are a subset of machine learning and are at the heart of deep learning algorithms."
    c.drawString(inch, height - 1.5*inch, text)
    
    # 1. Create a dummy image
    from PIL import Image
    dummy_img_path = "pipeline/data/dummy_chart.png"
    img = Image.new('RGB', (100, 100), color = 'red')
    img.save(dummy_img_path)

    # 2. Draw the image (Raster)
    c.drawImage(dummy_img_path, inch, height - 4*inch, width=2*inch, height=2*inch)
    
    c.setFillColorRGB(0, 0, 0)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(1.5*inch, height - 4.2*inch, "Figure 1: Neural Network Diagram")
    
    # More text below image
    c.setFont("Helvetica", 12)
    c.drawString(inch, height - 4.5*inch, "As shown in the figure above, layers utilize nodes to process data.")
    
    c.showPage()
    c.save()
    print(f"Created test PDF at {filename}")

if __name__ == "__main__":
    create_test_pdf()
