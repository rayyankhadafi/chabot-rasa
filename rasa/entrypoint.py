import os
import sys
import subprocess
import time
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
import urllib.request
import urllib.error

# Optimize memory for TensorFlow/NumPy on 512MB RAM cloud instances
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

TARGET_PORT = 5005
LISTEN_PORT = int(os.environ.get("PORT", 10000))

class ProxyHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Keep logs clean
        pass

    def do_GET(self):
        self._proxy("GET")

    def do_POST(self):
        self._proxy("POST")

    def do_OPTIONS(self):
        self._proxy("OPTIONS")

    def do_HEAD(self):
        self._proxy("HEAD")

    def _proxy(self, method):
        url = f"http://127.0.0.1:{TARGET_PORT}{self.path}"
        headers = {k: v for k, v in self.headers.items() if k.lower() != 'host'}
        body = None
        if 'Content-Length' in self.headers:
            length = int(self.headers['Content-Length'])
            body = self.rfile.read(length)

        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                self.send_response(resp.status)
                for k, v in resp.headers.items():
                    if k.lower() not in ['transfer-encoding', 'content-length']:
                        self.send_header(k, v)
                content = resp.read()
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            for k, v in e.headers.items():
                if k.lower() not in ['transfer-encoding', 'content-length']:
                    self.send_header(k, v)
            content = e.read()
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except Exception:
            # Return status loading quickly if Rasa model is still initializing
            msg = b'{"message": "Rasa API is initializing model in background...", "status": "loading"}'
            self.send_response(503)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(msg)))
            self.end_headers()
            self.wfile.write(msg)

def main():
    print(f"[Rasa Proxy] Binding 0.0.0.0:{LISTEN_PORT} instantly for Render port scanner...", flush=True)
    
    # 1. Start Rasa Action Server internally
    print("[Rasa Proxy] Launching Rasa Action Server on 127.0.0.1:5055...", flush=True)
    env = os.environ.copy()
    env["SANIC_HOST"] = "127.0.0.1"
    subprocess.Popen(["rasa", "run", "actions", "--port", "5055"], env=env)

    # 2. Start Rasa API Server internally
    cors_origin = os.environ.get("CORS_ORIGIN", "*")
    print(f"[Rasa Proxy] Launching Rasa API Server on 127.0.0.1:{TARGET_PORT}...", flush=True)
    subprocess.Popen([
        "rasa", "run", "--enable-api",
        "-i", "127.0.0.1",
        "-p", str(TARGET_PORT),
        "--cors", cors_origin,
        "--credentials", "credentials.yml",
        "--endpoints", "endpoints.yml"
    ])

    # 3. Use ThreadingHTTPServer so Render requests are never blocked
    server = ThreadingHTTPServer(('0.0.0.0', LISTEN_PORT), ProxyHandler)
    print(f"[Rasa Proxy] Multi-threaded proxy active on port {LISTEN_PORT} - Render Port Scan PASSED!", flush=True)
    server.serve_forever()

if __name__ == "__main__":
    main()
