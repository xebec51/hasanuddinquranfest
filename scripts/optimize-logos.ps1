# Generate web-sized derivatives; originals are never overwritten.
Add-Type -AssemblyName System.Drawing
$projectDirectory = Split-Path -Parent $PSScriptRoot
$assetDirectory = Join-Path $projectDirectory 'src/assets'
$variants = @(
  @{ Source = 'LOGO HQF.png'; Name = 'hqf.png'; Width = 800 },
  @{ Source = 'Logo UKM PSQ.png'; Name = 'psq.png'; Width = 180 },
  @{ Source = 'logo-unhas-resmi-berwarna-png-transparan.png'; Name = 'unhas.png'; Width = 140 }
)
foreach ($variant in $variants) {
  $sourceImage = [System.Drawing.Image]::FromFile((Join-Path $projectDirectory $variant.Source))
  try {
    $outputHeight = [int][Math]::Round($sourceImage.Height * $variant.Width / $sourceImage.Width)
    $resizedImage = New-Object System.Drawing.Bitmap($variant.Width, $outputHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($resizedImage)
    try {
      $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.DrawImage($sourceImage, 0, 0, $variant.Width, $outputHeight)
      $resizedImage.Save((Join-Path $assetDirectory $variant.Name), [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $graphics.Dispose(); $resizedImage.Dispose() }
  } finally { $sourceImage.Dispose() }
}

# Temporary CLI only: no sharp dependency is added to the website or build.
& npm.cmd exec --yes --package=sharp-cli -- sharp -i (Join-Path $assetDirectory 'hqf.png') -o (Join-Path $assetDirectory 'hqf.webp') -f webp -q 92 --effort 6
if ($LASTEXITCODE -ne 0) { throw 'HQF WebP generation failed' }
& npm.cmd exec --yes --package=sharp-cli -- sharp -i (Join-Path $assetDirectory 'hqf.png') -o (Join-Path $assetDirectory 'hqf-icon.png') -f png resize 64
if ($LASTEXITCODE -ne 0) { throw 'HQF favicon generation failed' }
