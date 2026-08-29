# Jaipur Stonecraft — Windows Task Scheduler Setup for Aiven Cloud Sync
$TaskName = "JaipurStonecraft_AivenSync"
$ProjectPath = (Get-Item -Path $PSScriptRoot).Parent.FullName
$NodePath = (Get-Command node).Source

Write-Host "=================================================="
Write-Host "JAIPUR STONECRAFT — WINDOWS TASK SCHEDULER SETUP"
Write-Host "Task Name: $TaskName"
Write-Host "Project Directory: $ProjectPath"
Write-Host "Node Executable: $NodePath"
Write-Host "Frequency: Every 30 Minutes"
Write-Host "=================================================="

$Action = New-ScheduledTaskAction -Execute $NodePath -Argument "--env-file=.env scripts/sync-cloud-to-local.mjs" -WorkingDirectory $ProjectPath
$Trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 30) -RepetitionDuration ([TimeSpan]::MaxValue)
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew

try {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
} catch {}

try {
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Description "Jaipur Stonecraft automated read-only Aiven MySQL snapshot and local mirror refresh"
    Write-Host ""
    Write-Host "SUCCESS: Task '$TaskName' has been registered in Windows Task Scheduler!"
    Write-Host "It will run automatically every 30 minutes in background."
} catch {
    Write-Host ""
    Write-Host "Warning: Could not register task: $_"
}
