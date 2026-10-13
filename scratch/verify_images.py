import re
import os

with open('treatments.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all img src tags
src_matches = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
print(f"Total img tags in treatments.html: {len(src_matches)}")

for idx, src in enumerate(src_matches, 1):
    exists = os.path.exists(src)
    file_size = os.path.getsize(src) if exists else 0
    print(f"{idx}. {src} | Exists: {exists} | Size: {file_size:,} bytes")

unique_srcs = set(src_matches)
print(f"\nUnique images: {len(unique_srcs)} out of {len(src_matches)}")
if len(unique_srcs) == len(src_matches):
    print("STRICTLY NO REPEATED IMAGES: VERIFIED 100% UNIQUE!")
else:
    print("DUPLICATES FOUND!")
