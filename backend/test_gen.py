import asyncio
import sys
import logging

logging.basicConfig(level=logging.INFO)

from dotenv import load_dotenv
load_dotenv()
sys.path.insert(0, '.')
from app.services.curriculum_factory import generate_dynamic_lesson

async def main():
    print("Testing dynamic lesson generation...")
    try:
        res = await generate_dynamic_lesson('a1-1', 'es')
        print("RESULT:")
        print(res)
    except Exception as e:
        print("ERROR:")
        print(type(e), str(e))

if __name__ == "__main__":
    asyncio.run(main())
