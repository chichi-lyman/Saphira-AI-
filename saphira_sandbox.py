import docker
from docker.errors import ContainerError, ImageNotFound

class SaphiraAgentSandbox:
    def __init__(self, image_name: str = "python:3.11-slim"):
        self.client = docker.from_env()
        self.image_name = image_name

    def execute_untrusted_code(self, script_contents: str, timeout_seconds: int = 5) -> dict:
        """
        Executes untrusted agent-generated code inside an isolated, resource-constrained container.
        Prevents lateral network movement and host filesystem corruption.
        """
        # Wrapping script to return safely or print output
        command_to_run = ["python", "-c", script_contents]
        
        try:
            # Enforce hard boundaries on execution
            container_result = self.client.containers.run(
                image=self.image_name,
                command=command_to_run,
                network_disabled=True,       # Prevents data exfiltration / command control calls
                mem_limit="128m",            # Prevents out-of-memory denial of service attacks
                nano_cpus=500000000,         # Cap at 0.5 CPU core to block processing loops
                remove=True,                 # Ensures the container is ephemeral and instantly wiped
                stdout=True,
                stderr=True,
                timeout=timeout_seconds      # Halts execution if agent hangs
            )
            return {"status": "success", "output": container_result.decode('utf-8')}
            
        except ContainerError as ce:
            return {"status": "execution_error", "output": ce.stderr.decode('utf-8')}
        except Exception as e:
            return {"status": "system_failure", "output": str(e)}
