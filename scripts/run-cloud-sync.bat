@echo off
cd /d "d:\jsc\jsc web1"
echo ================================================== >> backups\db\cloud_sync\sync.log 2>&1
echo [AUTO-SYNC ^& BACKUP TRIGGERED AT %DATE% %TIME%] >> backups\db\cloud_sync\sync.log 2>&1
echo ================================================== >> backups\db\cloud_sync\sync.log 2>&1

:: Step 1: Sync Aiven MySQL Cloud -> Local MySQL Mirror
node --env-file=.env scripts/sync-cloud-to-local.mjs >> backups\db\cloud_sync\sync.log 2>&1

:: Step 2: Run Master Change-Aware Local + Google Drive Backup
node --env-file=.env scripts/backup-runner.js >> backups\db\cloud_sync\sync.log 2>&1
