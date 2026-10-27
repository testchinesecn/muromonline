"""Encode existing web assets and vendor the fonts; do not alter game sources."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json
import re
import urllib.request
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
ASSETS = DIST / 'assets'
results = []
for atlas in (ASSETS / 'characters').glob('*/skeleton.atlas'):
    text = atlas.read_text(encoding='utf-8')
    for source in atlas.parent.glob('*.png'):
        target = source.with_suffix('.webp')
        original = Image.open(source).convert('RGBA')
        original.save(target, 'WEBP', lossless=True, exact=True, method=6)
        assert Image.open(target).convert('RGBA').tobytes() == original.tobytes()
        results.append({'asset': source.relative_to(DIST).as_posix(), 'before': source.stat().st_size, 'after': target.stat().st_size})
        text = text.replace(source.name, target.name)
        source.unlink()
    atlas.write_text(text, encoding='utf-8')

source = ASSETS / 'wanted-poster-frame.png'
if source.exists():
    target = source.with_suffix('.webp')
    Image.open(source).save(target, 'WEBP', quality=95, method=6)
    results.append({'asset': source.name, 'before': source.stat().st_size, 'after': target.stat().st_size})
    source.unlink()

font_url = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap'
request = urllib.request.Request(font_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'})
with urllib.request.urlopen(request, timeout=30) as response:
    css = response.read().decode()
blocks = re.findall(r'/\* (.*?) \*/\s*(@font-face\s*\{.*?\})', css, re.S)
css = '\n'.join(block for subset, block in blocks if subset in ('latin', 'vietnamese'))
urls = sorted(set(re.findall(r'url\((https://[^)]+)\)', css)))
assert urls, 'Font response must contain the requested Latin and Vietnamese subsets.'
font_dir = ASSETS / 'fonts'
font_dir.mkdir(exist_ok=True)
def download(url):
    target = font_dir / url.rsplit('/', 1)[-1]
    if not target.exists():
        with urllib.request.urlopen(url, timeout=30) as response:
            target.write_bytes(response.read())
    return url, 'assets/fonts/' + target.name
with ThreadPoolExecutor(max_workers=8) as pool:
    for remote, local in pool.map(download, urls):
        css = css.replace(remote, local)
for family in ('barlowcondensed', 'bevietnampro'):
    with urllib.request.urlopen(f'https://raw.githubusercontent.com/google/fonts/main/ofl/{family}/OFL.txt', timeout=30) as response:
        (font_dir / f'{family}-OFL.txt').write_bytes(response.read())
style = DIST / 'style.css'
text = style.read_text(encoding='utf-8-sig')
text = re.sub(r"^@import url\('https://fonts.googleapis.com/[^\n]+\n", '', text)
if '/* End bundled Google Fonts */' in text:
    text = text.split('/* End bundled Google Fonts */', 1)[1].lstrip()
else:
    text = text.replace('/* Bundled Google Fonts */\n', '', 1).lstrip()
style.write_text('/* Bundled Google Fonts */\n' + css + '\n/* End bundled Google Fonts */\n' + text, encoding='utf-8')

print(json.dumps({'images': results, 'localFontFiles': len(urls), 'bytesSaved': sum(r['before'] - r['after'] for r in results)}, indent=2))
