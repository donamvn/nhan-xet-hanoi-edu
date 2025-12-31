Add-Type -AssemblyName System.Drawing

function Create-Icon {
    param($size, $path)
    
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = 'AntiAlias'
    
    # Nền xanh tím
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(102, 126, 234))
    $graphics.FillEllipse($brush, 0, 0, ($size-1), ($size-1))
    
    # Vẽ chữ A
    $fontSize = [int]($size * 0.5)
    $font = New-Object System.Drawing.Font('Segoe UI', $fontSize, [System.Drawing.FontStyle]::Bold)
    $textBrush = [System.Drawing.Brushes]::White
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = 'Center'
    $format.LineAlignment = 'Center'
    $rect = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
    $graphics.DrawString('A', $font, $textBrush, $rect, $format)
    
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Created: $path"
}

$basePath = Split-Path -Parent $MyInvocation.MyCommand.Path
Create-Icon -size 16 -path "$basePath\icon16.png"
Create-Icon -size 48 -path "$basePath\icon48.png"
Create-Icon -size 128 -path "$basePath\icon128.png"

Write-Host "All icons created successfully!"
