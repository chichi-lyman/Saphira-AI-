import http.server
import socketserver
import json
import threading

from saphira_core import SaphiraOrchestrator

class HealthCheckHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "healthy"}).encode())
        else:
            self.send_response(404)
            self.end_headers()

def run_health_server():
    PORT = 8080
    Handler = HealthCheckHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving healthcheck at port {PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    health_thread = threading.Thread(target=run_health_server, daemon=True)
    health_thread.start()
    
    print("Saphira AI starting Main execution loop...")
    orchestrator = SaphiraOrchestrator()
    # In a real setup, connect to websockets or event loop
    try:
        import time
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Shutting down...")
