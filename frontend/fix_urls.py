import os
import re

directory = r'c:\Users\jeico\onixlingo\language-ai-tutor\frontend'

target_code = "const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8020';"
target_code_raw = "const RAW_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company/api/v1' : 'http://127.0.0.1:8020/api/v1';"
target_code_ai = "process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8020';"

for root, _, files in os.walk(directory):
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            modified = False
            
            # Cases
            if 'const API_URL = process.env.NEXT_PUBLIC_API_URL || ' in content:
                content = re.sub(r"const API_URL = process\.env\.NEXT_PUBLIC_API_URL \|\| [^;]+;", target_code, content)
                modified = True
                
            if 'const RAW_URL = process.env.NEXT_PUBLIC_API_URL || ' in content:
                content = re.sub(r"const RAW_URL = process\.env\.NEXT_PUBLIC_API_URL \|\| [^;]+;", target_code_raw, content)
                modified = True
                
            if 'process.env.NEXT_PUBLIC_API_URL ?? "https://api.onixlingo.com";' in content:
                content = content.replace('process.env.NEXT_PUBLIC_API_URL ?? "https://api.onixlingo.com";', target_code_ai)
                modified = True

            if modified:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Updated {filepath}')
