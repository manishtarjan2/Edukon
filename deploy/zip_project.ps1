param(
  [string]$SourcePath = ".",
  [string]$OutZip = "..\edukon-deploy.zip"
)

# Create a zip archive of the project (excludes node_modules and .git by default)
Write-Host "Zipping project from: $SourcePath to $OutZip"

$absSource = Resolve-Path $SourcePath
$absOut = Resolve-Path (Split-Path $OutZip -Parent) | Select-Object -First 1
$bname = Split-Path $OutZip -Leaf

Push-Location $absSource
try {
  $exclude = @('.git','node_modules','deploy')
  $items = Get-ChildItem -Force | Where-Object { $exclude -notcontains $_.Name }
  if(Test-Path $OutZip) { Remove-Item $OutZip -Force }
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  [System.IO.Compression.ZipFile]::CreateFromDirectory($absSource, (Join-Path $absOut $bname))
  Write-Host "Created zip: " (Join-Path $absOut $bname)
} catch {
  Write-Error "Failed to create zip: $_"
} finally { Pop-Location }

Write-Host "Done."