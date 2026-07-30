import json
import urllib.request
import os

# Create stitch_html directory
os.makedirs('stitch_html', exist_ok=True)

# Path to the list_screens output JSON
json_path = r"C:\Users\Subhaharini S K\.gemini\antigravity-ide\brain\c0065e19-e028-4d04-b3a3-0ed1e01eee4a\.system_generated\steps\39\output.txt"

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for screen in data.get('screens', []):
    title = screen.get('title', 'Untitled').replace(' ', '_').replace('-', '').replace('__', '_')
    html_code = screen.get('htmlCode', {})
    download_url = html_code.get('downloadUrl')
    
    if download_url:
        print(f"Downloading {title}...")
        try:
            filename = f"stitch_html/{title}.html"
            urllib.request.urlretrieve(download_url, filename)
            print(f"Saved to {filename}")
        except Exception as e:
            print(f"Failed to download {title}: {e}")
