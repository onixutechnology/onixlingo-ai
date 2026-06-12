import os
import re

directory = r'c:\Users\jeico\onixlingo\language-ai-tutor\frontend'
target_code_ws1 = "const wsBaseUrl = process.env.NODE_ENV === 'production' ? 'wss://api.onixlingo.onixu.company/ws' : 'ws://127.0.0.1:8020/ws';"
target_code_ws2 = "process.env.NODE_ENV === 'production' ? 'wss://api.onixlingo.onixu.company/ws' : 'ws://127.0.0.1:8020/ws';"

for root, _, files in os.walk(directory):
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            modified = False
            
            if "const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8020/ws';" in content:
                content = content.replace("const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8020/ws';", target_code_ws1)
                modified = True
                
            if 'process.env.NEXT_PUBLIC_WS_URL ?? "wss://api.onixlingo.com/ws";' in content:
                content = content.replace('process.env.NEXT_PUBLIC_WS_URL ?? "wss://api.onixlingo.com/ws";', target_code_ws2)
                modified = True

            if modified:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Updated WS in {filepath}')
