import { execSync } from "child_process";
import fs from "fs";
import path from "path";

async function syncMedia() {
  console.log("=== SYNCHRONIZING LOCAL MEDIA TO HOSTINGER PRODUCTION ===");

  // 1. Create a tar archive of local public/images and public/uploads
  console.log("Creating tarball of local images & uploads...");
  execSync("tar -czf scratch/media_bundle.tar.gz -C public images uploads", { stdio: "inherit" });

  const stats = fs.statSync("scratch/media_bundle.tar.gz");
  console.log(`Media bundle created: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  // 2. Upload tarball to Hostinger
  console.log("Uploading media bundle to Hostinger via SCP...");
  execSync(
    'scp -i scratch/deploy_key -P 65002 -o BatchMode=yes -o StrictHostKeyChecking=accept-new scratch/media_bundle.tar.gz u209772524@217.21.91.171:/home/u209772524/media_bundle.tar.gz',
    { stdio: "inherit" }
  );

  // 3. Extract tarball on Hostinger
  console.log("Extracting media bundle on Hostinger into shared/uploads and current release...");
  const remoteCmd = `
    DOMAIN_ROOT="/home/u209772524/domains/lavenderblush-crab-850824.hostingersite.com"
    SHARED_UPLOADS="\${DOMAIN_ROOT}/hbuilds/shared/uploads"
    CURRENT_NODEJS="\${DOMAIN_ROOT}/hbuilds/current/nodejs"
    LAST_SOURCE="\${DOMAIN_ROOT}/hbuilds/last-source"

    mkdir -p /tmp/media_extract
    tar -xzf /home/u209772524/media_bundle.tar.gz -C /tmp/media_extract

    echo "Copying uploads to shared storage..."
    cp -r /tmp/media_extract/uploads/* "\${SHARED_UPLOADS}/" 2>/dev/null || true

    echo "Copying images to current release and last-source..."
    mkdir -p "\${CURRENT_NODEJS}/public/images"
    cp -r /tmp/media_extract/images/* "\${CURRENT_NODEJS}/public/images/" 2>/dev/null || true

    mkdir -p "\${LAST_SOURCE}/public/images" "\${LAST_SOURCE}/public/uploads"
    cp -r /tmp/media_extract/images/* "\${LAST_SOURCE}/public/images/" 2>/dev/null || true
    cp -r /tmp/media_extract/uploads/* "\${LAST_SOURCE}/public/uploads/" 2>/dev/null || true

    rm -rf /tmp/media_extract /home/u209772524/media_bundle.tar.gz
    echo "Media sync completed on remote server!"
  `;

  execSync(
    `ssh -i scratch/deploy_key -p 65002 -o BatchMode=yes -o StrictHostKeyChecking=accept-new u209772524@217.21.91.171 '${remoteCmd}'`,
    { stdio: "inherit" }
  );

  console.log("=== ALL LOCAL MEDIA SUCCESSFULLY SYNCED TO PRODUCTION! ===");
}

syncMedia().catch(console.error);
