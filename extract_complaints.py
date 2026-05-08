import PyPDF2
import os

files = [
    r"H:\Complaints_Policy_Section1_Purpose.pdf",
    r"H:\Complaints_Policy_Section2_Scope.pdf",
    r"H:\Complaints_Policy_Section3_Policy_Statement.pdf",
    r"H:\Complaints_Policy_Section3_Guiding_Principles.pdf",
    r"H:\Complaints_Policy_Section4_Principles.pdf",
    r"H:\Complaints_Policy_Section4_Complaints_Procedure.pdf",
    r"H:\Complaints_Policy_Section5_Making_a_Complaint.pdf",
    r"H:\Complaints_Policy_Section5_Timeframes.pdf",
    r"H:\Complaints_Policy_Section6_Roles_and_Responsibilities.pdf",
    r"H:\Complaints_Policy_Section6_Complaints_Log.pdf",
    r"H:\Complaints_Policy_Section7_Procedure.pdf",
    r"H:\Complaints_Policy_Section7_Anonymous_Complaints.pdf",
    r"H:\Complaints_Policy_Section8_Records.pdf",
    r"H:\Complaints_Policy_Section8_Learning_Improvement.pdf",
    r"H:\Complaints_Policy_Section9_Right_to_Appeal.pdf",
    r"H:\Complaints_Policy_Section9_External_Contacts.pdf",
    r"H:\Complaints_Policy_Section10_Policy_Review.pdf",
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
