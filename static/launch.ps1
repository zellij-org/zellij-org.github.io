$dir = Join-Path $env:TEMP "zellij\bootstrap"
New-Item -ItemType Directory -Path $dir -Force | Out-Null

$binary = Join-Path $dir "zellij.exe"

if (Test-Path $binary) {
    & $binary @args
    return
}

switch ($env:PROCESSOR_ARCHITECTURE) {
    "AMD64" { $arch = "x86_64" }
    default {
        Write-Host "Unsupported cpu arch: $env:PROCESSOR_ARCHITECTURE"
        return
    }
}

$url = "https://github.com/zellij-org/zellij/releases/latest/download/zellij-$arch-pc-windows-msvc.zip"
$zipPath = Join-Path $dir "zellij.zip"

try {
    Invoke-WebRequest -Uri $url -OutFile $zipPath -UseBasicParsing
} catch {
    Write-Host ""
    Write-Host "Download failed, cannot launch zellij :("
    Write-Host "One probable cause is that a new release just happened and the binary is currently building."
    Write-Host "Maybe try again later? :)"
    return
}

try {
    Expand-Archive -Path $zipPath -DestinationPath $dir -Force
    Remove-Item $zipPath
} catch {
    Write-Host ""
    Write-Host "Extracting binary failed, cannot launch zellij :("
    Write-Host "One probable cause is that a new release just happened and the binary is currently building."
    Write-Host "Maybe try again later? :)"
    return
}

& $binary @args
return
