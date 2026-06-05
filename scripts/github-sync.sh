#!/bin/bash
# Saphira GitHub Sync Script
# Connects to Nova Umbrella infrastructure and authenticates via API Keys.

set -e

echo "=========================================="
echo "Saphira ASI - GitHub Sync & Deployment"
echo "=========================================="

# Use GITHUB_AUTH_TOKEN or fallback to GITHUB_TOKEN for backwards compatibility
AUTH_TOKEN="${GITHUB_AUTH_TOKEN:-$GITHUB_TOKEN}"

if [ -z "$AUTH_TOKEN" ]; then
  echo "Error: GITHUB_AUTH_TOKEN or GITHUB_TOKEN environment variable is not set."
  echo "Please configure it in the Saphira API Key Manager."
  exit 1
fi

if [ -z "$GITHUB_REPO" ]; then
  echo "Warning: GITHUB_REPO not set. Defaults to 'origin'."
  GITHUB_REPO="origin"
fi

if [ -z "$GITHUB_USER" ]; then
  echo "Warning: GITHUB_USER not set. Defaults to 'user'."
  GITHUB_USER="user"
fi

echo "[1/4] Authenticating with GitHub..."
# Simulate or perform authentication checks
# Note: Ensure the tracking is accurate based on user and repo if 'origin' isn't properly configured with oauth2.
git remote set-url "$GITHUB_REPO" "https://oauth2:${AUTH_TOKEN}@github.com/${GITHUB_USER}/Nova_Umbrella.git" || echo "Warning: Git remote update failed. Please check if inside a git repository."

echo "[2/4] Pulling latest changes from $GITHUB_REPO..."
git pull "$GITHUB_REPO" main --rebase || echo "Warning: Pull failed. You may have merge conflicts, or the repository is empty."

echo "[3/4] Staging changes..."
git add .

if git diff-index --quiet HEAD --; then
    echo "No changes to commit. Sync complete."
else
    echo "[4/4] Committing and Pushing changes..."
    # Generate timestamp for the commit message
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    git commit -m "Auto-sync from Saphira ASI (Agent Zero) at $TIMESTAMP"
    
    # Push back to main branch
    if git push "$GITHUB_REPO" HEAD:main; then
        echo "Successfully deployed to GitHub."
    else
        echo "Error: Failed to push to GitHub."
        exit 1
    fi
    echo "Sync Successful."
fi

