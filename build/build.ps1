param([string]$OutputDirectory = "$PSScriptRoot\output")

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ComponentRoot = Join-Path $ProjectRoot 'package\component'
$PackageManifest = Join-Path $ProjectRoot 'pkg_smartbrowser.xml'
$StageRoot = Join-Path $PSScriptRoot 'stage'
$ComponentZip = Join-Path $StageRoot 'packages\com_smartbrowser.zip'
$PluginRoot = Join-Path $ProjectRoot 'package\plugins\system\smartbrowserintegration'
$PluginZip = Join-Path $StageRoot 'packages\plg_system_smartbrowserintegration.zip'
$PackageZip = Join-Path $OutputDirectory 'pkg_smartbrowser-v1.0.0.zip'
$BuiltScript = Join-Path $ComponentRoot 'media\js\smartbrowser.js'

function Reset-Directory {
    param([Parameter(Mandatory = $true)][string] $Path)

    if (Test-Path $Path) {
        Remove-Item -LiteralPath $Path -Recurse -Force
    }

    New-Item -ItemType Directory -Path $Path | Out-Null
}

function New-PortableZip {
    param(
        [Parameter(Mandatory = $true)][string] $SourceDirectory,
        [Parameter(Mandatory = $true)][string] $DestinationZip
    )

    if (Test-Path $DestinationZip) {
        Remove-Item -LiteralPath $DestinationZip -Force
    }

    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $destinationStream = [System.IO.File]::Open($DestinationZip, [System.IO.FileMode]::Create)

    try {
        $archive = [System.IO.Compression.ZipArchive]::new(
            $destinationStream,
            [System.IO.Compression.ZipArchiveMode]::Create,
            $false
        )

        try {
            $rootPath = [System.IO.Path]::GetFullPath($SourceDirectory)

            Get-ChildItem -LiteralPath $SourceDirectory -Recurse -File | ForEach-Object {
                $filePath = [System.IO.Path]::GetFullPath($_.FullName)
                $entryPath = $filePath.Substring($rootPath.Length).TrimStart('\', '/').Replace('\', '/')
                [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                    $archive,
                    $filePath,
                    $entryPath,
                    [System.IO.Compression.CompressionLevel]::Optimal
                ) | Out-Null
            }
        } finally {
            $archive.Dispose()
        }
    } finally {
        $destinationStream.Dispose()
    }
}

function Assert-PortableZip {
    param([Parameter(Mandatory = $true)][string] $ZipPath)

    $archive = [System.IO.Compression.ZipFile]::OpenRead($ZipPath)

    try {
        $invalidEntries = @($archive.Entries | Where-Object { $_.FullName.Contains('\') })

        if ($invalidEntries.Count -gt 0) {
            throw "ZIP contains Windows-style entry paths: $($invalidEntries.FullName -join ', ')"
        }
    } finally {
        $archive.Dispose()
    }
}

Reset-Directory -Path $OutputDirectory
Reset-Directory -Path $StageRoot
New-Item -ItemType Directory -Path (Split-Path -Parent $ComponentZip) | Out-Null

if ((Get-Content -LiteralPath $BuiltScript -Raw).Contains('process.env')) {
    throw 'The browser bundle contains an unresolved process.env reference.'
}

New-PortableZip -SourceDirectory $ComponentRoot -DestinationZip $ComponentZip
Assert-PortableZip -ZipPath $ComponentZip
New-PortableZip -SourceDirectory $PluginRoot -DestinationZip $PluginZip
Assert-PortableZip -ZipPath $PluginZip

Copy-Item -LiteralPath $PackageManifest -Destination $StageRoot
Copy-Item -LiteralPath (Join-Path $ProjectRoot 'language') -Destination $StageRoot -Recurse

New-PortableZip -SourceDirectory $StageRoot -DestinationZip $PackageZip
Assert-PortableZip -ZipPath $PackageZip

Write-Output $PackageZip
