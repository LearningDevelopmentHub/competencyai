#!/usr/bin/env bash
set -euo pipefail

# package.sh - create a deliverable bundle and a branch tarball
# Usage: scripts/package.sh [branch]
# Defaults to: gd6/reporting-analytics

BRANCH=${1:-gd6/reporting-analytics}
DATE=$(date +"%Y%m%d")
OUTDIR=dist
BUNDLE_NAME="competencyai-all-branches.bundle"
TARBALL_NAME="competencyai-${BRANCH}-${DATE}.tar.gz"

mkdir -p "$OUTDIR"

echo "Creating git bundle (all refs) -> $OUTDIR/$BUNDLE_NAME"
git bundle create "$OUTDIR/$BUNDLE_NAME" --all

echo "Creating branch tarball for branch: $BRANCH -> $OUTDIR/$TARBALL_NAME"
# Ensure branch exists locally
if ! git rev-parse --verify --quiet "$BRANCH" >/dev/null; then
  echo "Branch $BRANCH not found locally. Fetching..."
  git fetch origin "$BRANCH":"$BRANCH"
fi

git archive --format=tar.gz -o "$OUTDIR/$TARBALL_NAME" "$BRANCH"

# Generate checksums
pushd "$OUTDIR" >/dev/null
  echo "Generating sha256 checksums -> sha256sum.txt"
  sha256sum "$BUNDLE_NAME" "$TARBALL_NAME" > sha256sum.txt
popd >/dev/null

echo "Packaging complete. Artifacts in $OUTDIR"
ls -l "$OUTDIR"

echo "To verify: sha256sum --check $OUTDIR/sha256sum.txt"

echo "If you want a zip instead of tar.gz, run: tar -xzf $OUTDIR/$TARBALL_NAME -C tempdir && zip -r $OUTDIR/competencyai-${BRANCH}-${DATE}.zip tempdir && rm -rf tempdir"
