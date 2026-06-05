import os
import sys
import time
import subprocess
import requests

# --- CONFIGURATION ---
GITHUB_USER = os.getenv("GITHUB_USER", "chichi-lyman")
REPO_NAME = os.getenv("GITHUB_REPO", "Nova_Umbrella")
GITHUB_TOKEN = os.getenv("GITHUB_AUTH_TOKEN") 
LOCAL_REPO_PATH = os.getcwd() # Uses the environment's current working directory
BRANCH = "main"

def check_for_updates():
    print(f"[{time.ctime()}] Saphira ASI (Aura Protocol): Scanning GitHub for updates...")
    
    if not GITHUB_TOKEN:
        print("Error: GITHUB_AUTH_TOKEN is not set. Terminating sync check.")
        return

    # Fetch the latest commit hash from GitHub API
    url = f"https://api.github.com/repos/{GITHUB_USER}/{REPO_NAME}/branches/{BRANCH}"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            remote_sha = response.json()['commit']['sha']
        else:
            print(f"Error checking GitHub API: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"Network error while trying to reach GitHub: {e}")
        return
        
    # Check local SHA
    try:
        local_sha = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=LOCAL_REPO_PATH, stderr=subprocess.DEVNULL).decode().strip()
    except subprocess.CalledProcessError:
        local_sha = "" # Initial state or not a git repo
        print("Note: Local directory is not initialized as a git repository or has no commits.")
        
    if remote_sha != local_sha:
        print(f">>> DEVIATION DETECTED. Remote SHA: {remote_sha[:7]} | Local SHA: {local_sha[:7] if local_sha else 'None'}")
        print(">>> Initializing Forensic Scan & Safe Build...")
        run_safe_build()
    else:
        print("System synced. No changes detected. All systems optimal.")

def run_safe_build():
    try:
        # Authenticate git remote using token
        remote_url = f"https://oauth2:{GITHUB_TOKEN}@github.com/{GITHUB_USER}/{REPO_NAME}.git"
        
        # Ensure tracking is correct
        if not os.path.exists(os.path.join(LOCAL_REPO_PATH, ".git")):
            subprocess.run(["git", "init"], cwd=LOCAL_REPO_PATH, check=True)
            subprocess.run(["git", "remote", "add", "origin", remote_url], cwd=LOCAL_REPO_PATH, check=True)
        else:
            subprocess.run(["git", "remote", "set-url", "origin", remote_url], cwd=LOCAL_REPO_PATH, check=True)

        print("[Step 1] Fetching deviations from origin...")
        subprocess.run(["git", "fetch", "origin", BRANCH], cwd=LOCAL_REPO_PATH, check=True)
        
        print("[Step 2] Displaying deviations (stat)...")
        subprocess.run(["git", "diff", "--stat", f"HEAD..origin/{BRANCH}"], cwd=LOCAL_REPO_PATH)
        
        print("[Step 3] Auto-pulling changes into Sandbox...")
        subprocess.run(["git", "pull", "--rebase", "origin", BRANCH], cwd=LOCAL_REPO_PATH, check=True)
        
        print("[Step 4] Triggering Safe Build process...")
        # Since this is a Node.js/Vite full-stack app, run npm install and npm run build
        print(">> Running npm install...")
        subprocess.run(["npm", "install"], cwd=LOCAL_REPO_PATH)
        
        print(">> Running npm build verification...")
        build_task = subprocess.run(["npm", "run", "build"], cwd=LOCAL_REPO_PATH, capture_output=True, text=True)
        
        if build_task.returncode == 0:
            print("\n[!] SAFE BUILD COMPLETE [!]")
            print("Forensic Filter confirms code integrity.")
            print("SUCCESS: Local folders updated and Saphira AI ready for the newly pulled changes.")
        else:
            print("\n[X] SAFE BUILD FAILED [X]")
            print(f"Build Errors:\n{build_task.stderr}")
            print("Forensic Alert: Build process corrupted or aborted due to compile errors. Please intervene manually.")
            
    except subprocess.CalledProcessError as e:
        print(f"Git or Build command failed: {e}")
    except Exception as e:
        print(f"Forensic Alert: Sync operation encountered a fatal exception: {e}")

if __name__ == "__main__":
    if not GITHUB_TOKEN:
        print("WARNING: GITHUB_AUTH_TOKEN not set in environment. GitHub API may rate limit or deny access to private repos.")
    while True:
        check_for_updates()
        time.sleep(300) # Check every 5 minutes
