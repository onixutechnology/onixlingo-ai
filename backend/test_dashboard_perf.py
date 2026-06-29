import requests, time, json

# Login con credenciales de admin
login_data = {"username": "OnixuAdmin", "password": "Onixuad9.87mi-n"}
try:
    r = requests.post("http://127.0.0.1:8020/api/v1/auth/login", json=login_data, timeout=10)
    if r.status_code != 200:
        login_data["username"] = "onixutechnology@gmail.com"
        r = requests.post("http://127.0.0.1:8020/api/v1/auth/login", json=login_data, timeout=10)
    print(f"Login status: {r.status_code}")
    if r.status_code == 200:
        token = r.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        # Medir dashboard-all
        start = time.time()
        r2 = requests.get("http://127.0.0.1:8020/api/v1/admin/dashboard-all", headers=headers, timeout=30)
        elapsed = time.time() - start
        print(f"Dashboard-all status: {r2.status_code}")
        print(f"Tiempo de respuesta: {elapsed:.3f}s")
        if r2.status_code == 200:
            data = r2.json()
            print(f"Keys recibidas: {len(data.keys())}")
            for k, v in data.items():
                print(f"  {k}: {v}")
        else:
            print(f"Error: {r2.text[:500]}")
    else:
        print(f"Login failed: {r.text[:300]}")
except Exception as e:
    print(f"Error: {e}")
