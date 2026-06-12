import sys
import builtins
import time

original_import = builtins.__import__

def custom_import(name, globals=None, locals=None, fromlist=(), level=0):
    print(f"[{time.time()}] Importing: {name}")
    sys.stdout.flush()
    return original_import(name, globals, locals, fromlist, level)

builtins.__import__ = custom_import

print("Starting import main")
sys.stdout.flush()
import main
print("Done")
