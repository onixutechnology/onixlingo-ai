import sys
import traceback

print("Attempting to import main...", flush=True)
try:
    import main
    print("Successfully imported main!", flush=True)
except Exception as e:
    print(f"ERROR: {e}", flush=True)
    traceback.print_exc(file=sys.stdout)

print("Attempting to run lifespan...", flush=True)
try:
    from fastapi import FastAPI
    import asyncio
    
    async def run_lifespan():
        app = FastAPI()
        async with main.lifespan(app):
            pass
            
    asyncio.run(run_lifespan())
    print("Lifespan ran successfully!", flush=True)
except Exception as e:
    print(f"LIFESPAN ERROR: {e}", flush=True)
    traceback.print_exc(file=sys.stdout)
