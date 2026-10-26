"""Export only public presentation assets from the local game client."""
import concurrent.futures
import json
import shutil
import urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
CLIENT = ROOT.parent / '01_CLIENT_PROJECT/Assets'
OUT = ROOT / 'dist/assets'
OUT.mkdir(parents=True, exist_ok=True)

for name in ['Harbor', 'Panel', 'GoldButton']:
    source = CLIENT / f'Resources/EntryUi/KhoiNguyen/Art/{name}.png'
    image = Image.open(source)
    image.save(OUT / f'{name.lower()}.webp', quality=90)

# Unpack an existing atlas region rather than inventing replacement game art.
chest = Image.open(CLIENT / 'Resources/BuggyTreasure/treasure.png')
chest.crop((388, 4, 768, 394)).save(OUT / 'treasure-chest.webp', quality=95)

for key, folder, stem in [('1-gear4', 'zoom_1', 'Gear_fourth'), ('3-stealth', 'zoom_3', 'sanji_hacan')]:
    source = CLIENT / 'Resources/datamanager/spine' / folder
    dest = OUT / 'characters' / key
    dest.mkdir(parents=True, exist_ok=True)
    data = json.loads((source / f'{stem}.json').read_text(encoding='utf-8-sig'))
    data['skeleton'].pop('audio', None)
    data['skeleton'].pop('images', None)
    (dest / 'skeleton.json').write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    shutil.copy2(source / f'{stem}.atlas.txt', dest / 'skeleton.atlas')
    for texture in source.glob('*.png'):
        shutil.copy2(texture, dest / texture.name)

catalog = CLIENT / 'RecoveredPcContent/catalog'
info = json.loads((catalog / 'SkillInfo.json').read_text(encoding='utf-8-sig'))['data']
stats = json.loads((catalog / 'SkillData.json').read_text(encoding='utf-8-sig'))['data']
characters = []
names = ['Luffy', 'Zoro', 'Sanji', 'Nami', 'Usopp']
roles = ['Thuyền trưởng · Cận chiến', 'Kiếm sĩ · Cận chiến', 'Hắc cước · Cận chiến', 'Hoa tiêu · Hỗ trợ', 'Xạ thủ · Tầm xa']
descriptions = [
    'Một chiếc mũ rơm, một lời hứa và giấc mơ trở thành Vua Hải Tặc. Luffy lao thẳng vào trận chiến với những đòn đánh cao su đầy uy lực, luôn là người mở đường cho đồng đội.',
    'Ba thanh kiếm và một ý chí không lay chuyển. Zoro áp sát đối thủ, tung những đường kiếm dứt khoát và cuốn kẻ địch vào cuồng phong của Tam Kiếm Phái.',
    'Đầu bếp của băng Mũ Rơm cũng là một chiến binh hắc cước. Những cú đá nhanh, mạnh cùng ngọn lửa rực cháy tạo nên phong cách chiến đấu riêng của Sanji.',
    'Hoa tiêu tài năng dẫn cả băng vượt qua những vùng biển khắc nghiệt. Nami điều khiển thời tiết, gọi sấm sét và hỗ trợ đồng đội bằng sức mạnh của gió.',
    'Chàng xạ thủ mang trong mình giấc mơ trở thành chiến binh dũng cảm của biển cả. Usopp chiến đấu từ xa với những loại đạn đặc biệt và khả năng khống chế linh hoạt.'
]
for i, name in enumerate(names, 1):
    dest = OUT / 'characters' / str(i)
    dest.mkdir(parents=True, exist_ok=True)
    source = CLIENT / f'RecoveredPcContent/herospine/type_{i}/1'
    skeleton = json.loads((source / 'payload.txt').read_text(encoding='utf-8-sig'))
    skeleton['skeleton'].pop('audio', None)
    skeleton['skeleton'].pop('images', None)
    (dest / 'skeleton.json').write_text(json.dumps(skeleton, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    shutil.copy2(source / 'atlas_payload.txt', dest / 'skeleton.atlas')
    for texture in source.glob('*.png'):
        shutil.copy2(texture, dest / texture.name)
    portrait = CLIENT / f'Resources/sprites/character on_off/{i}_On.png'
    shutil.copy2(portrait, OUT / f'portrait-{i}.png')
    skills = []
    for entry in info:
        if entry['idChar'] != i or entry['idSkill'] == 0:
            continue
        sid = entry['idSkill']
        icon = CLIENT / f'RecoveredPcContent/icons/skill/Big_{i}_{sid}.png'
        if not icon.exists():
            icon = CLIENT / f'RecoveredPcContent/icons/skill/item_skill_{i}_{sid}.png'
        shutil.copy2(icon, OUT / f'skill-{i}-{sid}.png')
        stat = next((s for s in stats if s.get('idCharacter') == i and s.get('idSkill') == sid and s.get('level') == 1), {})
        skills.append({'id': sid, 'name': entry['name'], 'description': entry['description'].strip(), 'mana': stat.get('mana'), 'level': stat.get('levelRequire'), 'animation': ('idle' if sid == 4 else 'skill_1_1' if sid == 1 else f'skill_{sid}')})
    characters.append({'id': i, 'name': name, 'role': roles[i-1], 'description': descriptions[i-1], 'skills': skills, 'animations': list(skeleton['animations'])})
(OUT / 'characters.json').write_text(json.dumps(characters, ensure_ascii=False, indent=2), encoding='utf-8')

def download(pair):
    url, filename = pair
    target = OUT / filename
    if not target.exists():
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request, timeout=60) as response:
            target.write_bytes(response.read())
    return filename, target.stat().st_size

downloads = [('https://cdn.jsdelivr.net/npm/@esotericsoftware/spine-webgl@4.1.56/dist/iife/spine-webgl.js', 'spine-webgl.js')]
with concurrent.futures.ThreadPoolExecutor() as pool:
    for result in pool.map(download, downloads):
        print(result)
print('Exported', len(characters), 'characters and', sum(len(c['skills']) for c in characters), 'skills.')
