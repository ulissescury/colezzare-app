# Script para copiar ícones do Colezzare para o Android
$base = "D:\APP\colezzare-scraper\colezzare-app\android\app\src\main\res"
$src  = "D:\APP\colezzare-scraper\colezzare-app\icons"

# Mapeia tamanho para pasta
$map = @{
    "ic_launcher_mdpi.png"     = "mipmap-mdpi"
    "ic_launcher_hdpi.png"     = "mipmap-hdpi"
    "ic_launcher_xhdpi.png"    = "mipmap-xhdpi"
    "ic_launcher_xxhdpi.png"   = "mipmap-xxhdpi"
    "ic_launcher_xxxhdpi.png"  = "mipmap-xxxhdpi"
}

foreach ($file in $map.Keys) {
    $dest = "$base\$($map[$file])"
    if (!(Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force }
    Copy-Item "$src\$file" "$dest\ic_launcher.png" -Force
    Copy-Item "$src\$file" "$dest\ic_launcher_round.png" -Force
    Write-Host "✅ $file → $($map[$file])"
}

Write-Host "`n✅ Ícones copiados com sucesso!"
