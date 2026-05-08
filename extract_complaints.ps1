$files = @(
    "H:\Complaints_Policy_Section1_Purpose.pdf",
    "H:\Complaints_Policy_Section2_Scope.pdf",
    "H:\Complaints_Policy_Section3_Policy_Statement.pdf",
    "H:\Complaints_Policy_Section3_Guiding_Principles.pdf",
    "H:\Complaints_Policy_Section4_Principles.pdf",
    "H:\Complaints_Policy_Section4_Complaints_Procedure.pdf",
    "H:\Complaints_Policy_Section5_Making_a_Complaint.pdf",
    "H:\Complaints_Policy_Section5_Timeframes.pdf",
    "H:\Complaints_Policy_Section6_Roles_and_Responsibilities.pdf",
    "H:\Complaints_Policy_Section6_Complaints_Log.pdf",
    "H:\Complaints_Policy_Section7_Procedure.pdf",
    "H:\Complaints_Policy_Section7_Anonymous_Complaints.pdf",
    "H:\Complaints_Policy_Section8_Records.pdf",
    "H:\Complaints_Policy_Section8_Learning_Improvement.pdf",
    "H:\Complaints_Policy_Section9_Right_to_Appeal.pdf",
    "H:\Complaints_Policy_Section9_External_Contacts.pdf",
    "H:\Complaints_Policy_Section10_Policy_Review.pdf"
)

foreach ($file in $files) {
    Write-Output "===== $file ====="
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $raw = [System.Text.Encoding]::UTF8.GetString($bytes)
    $matches = [regex]::Matches($raw, '\(([^)]{2,})\)')
    foreach ($m in $matches) {
        $val = $m.Groups[1].Value
        if ($val -match '[a-zA-Z]{2,}') {
            Write-Output $val
        }
    }
    Write-Output ""
}
