# Corrige ícone do Colezzare — fundo escuro no adaptive icon
$res = "D:\APP\colezzare-scraper\colezzare-app\android\app\src\main\res"
$src = "D:\APP\colezzare-scraper\colezzare-app\icons2"

# 1. Copia os PNGs para todas as pastas
$map = @{
    "ic_mdpi.png"     = "mipmap-mdpi"
    "ic_hdpi.png"     = "mipmap-hdpi"
    "ic_xhdpi.png"    = "mipmap-xhdpi"
    "ic_xxhdpi.png"   = "mipmap-xxhdpi"
    "ic_xxxhdpi.png"  = "mipmap-xxxhdpi"
}
foreach ($file in $map.Keys) {
    $dest = "$res\$($map[$file])"
    Copy-Item "$src\$file" "$dest\ic_launcher.png"          -Force
    Copy-Item "$src\$file" "$dest\ic_launcher_round.png"    -Force
    Copy-Item "$src\$file" "$dest\ic_launcher_foreground.png" -Force
    Write-Host "✅ $($map[$file])"
}

# 2. Cria ic_launcher_background.xml com cor escura
$mipmap_v26 = "$res\mipmap-anydpi-v26"
New-Item -ItemType Directory -Path $mipmap_v26 -Force | Out-Null

# XML do ic_launcher com fundo escuro
$launcher_xml = @'
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
'@
$launcher_xml | Set-Content "$mipmap_v26\ic_launcher.xml"
$launcher_xml | Set-Content "$mipmap_v26\ic_launcher_round.xml"

# 3. Cria o arquivo de cor de background
$values = "$res\values"
New-Item -ItemType Directory -Path $values -Force | Out-Null
$colors_xml = @'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#070508</color>
</resources>
'@
$colors_xml | Set-Content "$values\ic_launcher_background.xml"

Write-Host "`n✅ Ícone adaptativo configurado com fundo escuro #070508!"
Write-Host "Agora faça o rebuild do APK."
