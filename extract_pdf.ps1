$bytes = [System.IO.File]::ReadAllBytes("c:\Users\User\.gemini\antigravity\scratch\COSANTA\Child_Risk_Assessment_Blank_Template.pdf")
$raw = [System.Text.Encoding]::UTF8.GetString($bytes)
$matches = [regex]::Matches($raw, '\(([^)]{2,})\)')
foreach ($m in $matches) {
    $val = $m.Groups[1].Value
    if ($val -match '[a-zA-Z]{2,}') {
        Write-Output $val
    }
}
