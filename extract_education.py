import PyPDF2, os

files = [
    r"H:\Education_Arrangements_Secure_Living.pdf",
    r"H:\Education_Compliance_Toolkit_Secure_Living.pdf",
]

for f in files:
    print(f"===== {os.path.basename(f)} =====")
    try:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text = page.extract_text()
            if text:
                print(text)
    except Exception as e:
        print(f"ERROR: {e}")
    print()
