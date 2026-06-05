import os
import docker
from docker.errors import ContainerError, ImageNotFound

class AgentZeroOrchestrator:
    def __init__(self, image_name="saphira/agent-zero-sandbox:latest"):
        self.client = docker.from_env()
        self.image_name = image_name
        self.container = None
        self._ensure_image()

    def _ensure_image(self):
        try:
            self.client.images.get(self.image_name)
        except ImageNotFound:
            print(class_name := f"Pulling base image: {self.image_name}")
            self.client.images.pull(self.image_name)

    def execute_safe_script(self, script_contents: str, timeout: int = 30):
        """Executes a generated script within the secure container sandbox."""
        # Ensure workspace exists on host
        host_workspace = os.path.abspath("./sandbox_workspace")
        os.makedirs(host_workspace, exist_ok=True)
        
        # Write script to execution volume
        script_path = os.path.join(host_workspace, "payload.py")
        with open(script_path, "w") as f:
            f.write(script_contents)

        try:
            # Execute with restricted network, dropped capabilities, and read-only root filesystems where applicable
            output = self.client.containers.run(
                image=self.image_name,
                command="python /workspace/payload.py",
                volumes={host_workspace: {"bind": "/workspace", "mode": "rw"}},
                network_mode="none",  # Air-gapped isolation
                cap_drop=["ALL"],     # Drop all root privileges
                mem_limit="512m",     # Prevent memory exhaustion DOS
                nano_cpus=1000000000, # Limit to 1 CPU core
                remove=True,
                timeout=timeout
            )
            return {"status": "success", "output": output.decode("utf-8")}
        except ContainerError as ce:
            return {"status": "runtime_error", "output": ce.stderr.decode("utf-8")}
        except Exception as e:
            return {"status": "system_error", "output": str(e)}

# Operational Test
if __name__ == "__main__":
    orchestrator = AgentZeroOrchestrator()
    payload = "print('Agent Zero sandbox online. Testing recursive logic verification.')"
    result = orchestrator.execute_safe_script(payload)
    print(result)

