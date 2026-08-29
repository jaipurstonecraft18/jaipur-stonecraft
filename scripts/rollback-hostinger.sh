#!/usr/bin/env bash
# ==============================================================================
# Jaipur Stonecraft — Instant Production Rollback Engine
# ==============================================================================
set -euo pipefail

DOMAIN_ROOT="/home/u209772524/domains/lavenderblush-crab-850824.hostingersite.com"
HBUILDS_ROOT="${DOMAIN_ROOT}/hbuilds"
VERSIONS_DIR="${HBUILDS_ROOT}/versions"
CURRENT_LINK="${HBUILDS_ROOT}/current"

CURRENT_ACTIVE="$(readlink -f "${CURRENT_LINK}")"
echo "Current Active Release: ${CURRENT_ACTIVE}"

# Find previous release
PREVIOUS_RELEASE=""
for dir in $(ls -dt "${VERSIONS_DIR}"/*/ 2>/dev/null); do
    FULL_DIR="$(readlink -f "${dir}")"
    if [ "${FULL_DIR}" != "${CURRENT_ACTIVE}" ] && [ -d "${FULL_DIR}/nodejs" ]; then
        PREVIOUS_RELEASE="${dir%/}"
        break
    fi
done

if [ -z "${PREVIOUS_RELEASE}" ] || [ ! -d "${PREVIOUS_RELEASE}" ]; then
    echo "ERROR: No suitable previous release found in ${VERSIONS_DIR} to roll back to."
    exit 1
fi

REL_NAME="$(basename "${PREVIOUS_RELEASE}")"
echo "Rolling back to: ${PREVIOUS_RELEASE} (versions/${REL_NAME})"

ln -sfn "versions/${REL_NAME}" "${CURRENT_LINK}"

# Trigger reload
mkdir -p "${PREVIOUS_RELEASE}/nodejs/tmp"
touch "${PREVIOUS_RELEASE}/nodejs/tmp/restart.txt"
pkill -f "next-server" 2>/dev/null || true

echo "================================================================================"
echo "ROLLBACK COMPLETED SUCCESSFULLY!"
echo "Active Release: $(readlink -f "${CURRENT_LINK}")"
echo "================================================================================"
