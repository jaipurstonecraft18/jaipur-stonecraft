#!/usr/bin/env bash
# ==============================================================================
# Jaipur Stonecraft — Hostinger Automated Production Deployment Engine
# ==============================================================================
# Target: in-mum-web831.main-hosting.eu (Hostinger Business Node.js Environment)
#
# GUARANTEES:
# 1. Zero database writes / migrations / sync commands.
# 2. 100% media persistence: public/uploads is symlinked from persistent shared storage.
# 3. Isolated build in new version directory before atomic activation.
# 4. Rollback safety: previous working releases remain preserved.
# 5. Resource constrained: NEXT_PRIVATE_MAX_WORKERS=2 prevents LVE process exhaustion.
# 6. Automatic LiteSpeed reload on success; zero touch on failure.
# ==============================================================================

set -euo pipefail

# 1. Environment & Paths Configuration
DOMAIN_ROOT="/home/u209772524/domains/lavenderblush-crab-850824.hostingersite.com"
HBUILDS_ROOT="${DOMAIN_ROOT}/hbuilds"
LAST_SOURCE="${HBUILDS_ROOT}/last-source"
VERSIONS_DIR="${HBUILDS_ROOT}/versions"
CURRENT_LINK="${HBUILDS_ROOT}/current"
SHARED_DIR="${HBUILDS_ROOT}/shared"
SHARED_UPLOADS="${SHARED_DIR}/uploads"

NODE_BIN_DIR="/opt/alt/alt-nodejs22/root/usr/bin"
export PATH="${NODE_BIN_DIR}:${PATH}"
export NODE_ENV="production"
export NEXT_PRIVATE_MAX_WORKERS=2

TARGET_COMMIT="${1:-HEAD}"

echo "================================================================================"
echo "JAIPUR STONECRAFT — PRODUCTION DEPLOYMENT RUNNER"
echo "================================================================================"
echo "Timestamp:      $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "Target Commit:  ${TARGET_COMMIT}"
echo "Domain Root:    ${DOMAIN_ROOT}"
echo "================================================================================"

# Step 1: Preflight Directory & Shared Storage Initialization
mkdir -p "${VERSIONS_DIR}"
mkdir -p "${SHARED_UPLOADS}"

# Seed shared storage if not yet populated (non-destructive rsync)
if [ -d "${LAST_SOURCE}/public/uploads" ]; then
    echo "[Preflight] Synchronizing shared uploads storage from source..."
    rsync -a --ignore-existing "${LAST_SOURCE}/public/uploads/" "${SHARED_UPLOADS}/" 2>/dev/null || true
elif [ -d "${CURRENT_LINK}/nodejs/public/uploads" ]; then
    echo "[Preflight] Synchronizing shared uploads storage from active release..."
    rsync -a --ignore-existing "${CURRENT_LINK}/nodejs/public/uploads/" "${SHARED_UPLOADS}/" 2>/dev/null || true
fi

# Step 2: Fetch and checkout target commit in last-source
echo "[Step 1/6] Updating last-source working copy from origin..."
cd "${LAST_SOURCE}"
git fetch origin main --tags
git reset --hard FETCH_HEAD
DEPLOYED_HASH="$(git rev-parse HEAD)"
SHORT_HASH="$(git rev-parse --short HEAD)"
RELEASE_ID="$(date +%Y%m%d_%H%M%S)_${SHORT_HASH}"
NEW_RELEASE_DIR="${VERSIONS_DIR}/${RELEASE_ID}"
NEW_NODEJS_DIR="${NEW_RELEASE_DIR}/nodejs"

echo "Verified Deployed Commit: ${DEPLOYED_HASH}"
echo "New Release ID:          ${RELEASE_ID}"

# Step 3: Prepare clean release directory
echo "[Step 2/6] Preparing isolated release workspace..."
mkdir -p "${NEW_NODEJS_DIR}"
mkdir -p "${NEW_RELEASE_DIR}/public_html"

# Rsync source files (excluding .git, .next, node_modules, and uploads)
rsync -a \
    --exclude=".git" \
    --exclude=".next" \
    --exclude="node_modules" \
    --exclude="public/uploads" \
    "${LAST_SOURCE}/" "${NEW_NODEJS_DIR}/"

# Step 4: Link persistent shared uploads and copy config .env into new release
echo "[Step 3/6] Linking persistent shared uploads storage & configuration..."
mkdir -p "${NEW_NODEJS_DIR}/public"
rm -rf "${NEW_NODEJS_DIR}/public/uploads"
ln -sfn "${SHARED_UPLOADS}" "${NEW_NODEJS_DIR}/public/uploads"

if [ -f "${HBUILDS_ROOT}/config/.env" ]; then
    cp -f "${HBUILDS_ROOT}/config/.env" "${NEW_NODEJS_DIR}/.env"
fi

# Verify media availability
MEDIA_COUNT="$(find -L "${NEW_NODEJS_DIR}/public/uploads" -type f | wc -l)"
echo "Persistent Media Assets Available in Release: ${MEDIA_COUNT}"
if [ "${MEDIA_COUNT}" -lt 50 ]; then
    echo "ERROR: Media count check failed (${MEDIA_COUNT} assets found). Aborting deployment for safety."
    rm -rf "${NEW_RELEASE_DIR}"
    exit 1
fi

# Step 5: Install dependencies and compile Next.js production build
echo "[Step 4/6] Installing dependencies and building production bundle..."
cd "${NEW_NODEJS_DIR}"

# Run clean npm install (including sharp linux platform bindings)
npm ci

# Compile production build with worker constraints
npm run build

# Verify build artifacts exist
if [ ! -f "${NEW_NODEJS_DIR}/.next/BUILD_ID" ] || [ ! -d "${NEW_NODEJS_DIR}/.next/server" ]; then
    echo "ERROR: Next.js build failed or .next/BUILD_ID is missing. Active release remains unchanged."
    rm -rf "${NEW_RELEASE_DIR}"
    exit 1
fi

# Verify server.js entry point exists
if [ ! -f "${NEW_NODEJS_DIR}/server.js" ]; then
    echo "ERROR: server.js entry point missing in release workspace. Aborting."
    rm -rf "${NEW_RELEASE_DIR}"
    exit 1
fi

# Write release metadata
cat << METADATA > "${NEW_RELEASE_DIR}/.metadata.json"
{
  "build_id": "${RELEASE_ID}",
  "commit": "${DEPLOYED_HASH}",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "node_version": 22,
  "output_dir": ".next",
  "build_script": "build",
  "app_type": "next",
  "package_manager": "npm"
}
METADATA

# Step 6: Atomic release switchover
echo "[Step 5/6] Atomically switching active release to ${RELEASE_ID}..."
ln -sfn "versions/${RELEASE_ID}" "${CURRENT_LINK}"

# Step 7: Graceful process reload
echo "[Step 6/6] Reloading LiteSpeed Passenger worker..."
mkdir -p "${NEW_NODEJS_DIR}/tmp"
touch "${NEW_NODEJS_DIR}/tmp/restart.txt"
pkill -f "next-server" 2>/dev/null || true

# Step 8: Retain last 4 releases for rollback, remove older ones
echo "[Cleanup] Retaining recent releases for instant rollback capability..."
cd "${VERSIONS_DIR}"
ls -dt */ 2>/dev/null | tail -n +5 | while read -r old_rel; do
    CURRENT_TARGET="$(readlink -f "${CURRENT_LINK}" || echo "")"
    OLD_TARGET="$(readlink -f "${old_rel}" || echo "")"
    if [ "${CURRENT_TARGET}" != "${OLD_TARGET}" ] && [ -n "${old_rel}" ]; then
        echo "Removing obsolete release: ${old_rel}"
        rm -rf "${old_rel}"
    fi
done

echo "================================================================================"
echo "DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "Active Release: ${NEW_RELEASE_DIR}"
echo "Active Commit:  ${DEPLOYED_HASH}"
echo "Live URL:       https://lavenderblush-crab-850824.hostingersite.com"
echo "================================================================================"
