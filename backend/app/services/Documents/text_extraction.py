import fitz  # PyMuPDF
import pdfplumber
import pytesseract
from PIL import Image
import io

# If Tesseract isn't on PATH, uncomment and set your install path:
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def extract_text_pymupdf(file_path: str) -> str:
    text = ""
    doc = fitz.open(file_path)
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()


def extract_text_pdfplumber(file_path: str) -> str:
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()


def extract_text_ocr(file_path: str) -> str:
    """Fallback for scanned PDFs with no embedded text layer."""
    text = ""
    try:
        doc = fitz.open(file_path)
        for page in doc:
            pix = page.get_pixmap(dpi=200)
            img = Image.open(io.BytesIO(pix.tobytes("png")))
            text += pytesseract.image_to_string(img) + "\n"
        doc.close()
    except Exception:
        # OCR isn't critical-path; if Tesseract isn't installed, just skip it
        return ""
    return text.strip()


def extract_contract_text(file_path: str) -> str:
    """
    Tries PyMuPDF first (fast, handles most PDFs).
    Falls back to pdfplumber if PyMuPDF gets nothing.
    Falls back to OCR only if both fail (likely a scanned document).
    """
    text = extract_text_pymupdf(file_path)
    if len(text) > 50:
        return text

    text = extract_text_pdfplumber(file_path)
    if len(text) > 50:
        return text

    text = extract_text_ocr(file_path)
    return text