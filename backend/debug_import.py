import sys
import traceback
try:
    import main
    print("SUCCESS")
except Exception as e:
    traceback.print_exc(file=sys.stdout)
