import json
import os
import shutil
import functools
import re
import time

from PIL import Image
import requests
from tqdm import tqdm

item_image_path = './data/images/items/'
champion_image_path = './data/images/champions/'

hero_image_url = 'https://www.heroesofnewerth.com/images/heroes/{}/icon_128.jpg'
skill_image_url = 'https://www.heroesofnewerth.com/images/heroes/{}/ability{}_128.jpg'
item_image_url = 'https://www.heroesofnewerth.com/images/items/{}'

items_url = 'http://api.heroesofnewerth.com/items/all/?token=6V2D6Z89U8ZZWIVN'
item_url = 'http://api.heroesofnewerth.com/items/name/{}/?token=6V2D6Z89U8ZZWIVN'

champions_url = 'http://api.heroesofnewerth.com/heroes/all?token=6V2D6Z89U8ZZWIVN'
champion_url = 'http://api.heroesofnewerth.com/heroes/id/{}/?token=6V2D6Z89U8ZZWIVN'

os.makedirs(item_image_path, exist_ok=True)
os.makedirs(champion_image_path, exist_ok=True)

def clean_filename(filename):
    filename = ''.join(filename.split()).lower()
    extension_dot = filename.rindex('.')

    left_part = filename[:extension_dot]
    right_part = filename[extension_dot:]
    # Characters after last . can be [a-z] only
    right_part = " ".join(re.findall("[a-zA-Z]+", right_part))

    return "{}.{}".format(left_part, right_part)


def download_image(url, path, filename):
    response = requests.get(url, stream=True)
    if response.status_code != 200:
        raise Exception()

    filename = clean_filename(filename)
    full_path = os.path.join(path, filename)
    with open(full_path, 'wb') as outfile:
        shutil.copyfileobj(response.raw, outfile)

    # compress image
    image = Image.open(full_path)
    image.save(full_path, quality=95, optimize=True)
    del response

    return filename


def get_api_data(url):
    response = requests.get(url)
    while response.status_code == 429:
        print('Too many requests. Go sleep and try again.')
        time.sleep(1)
        response = requests.get(url)

    if response.status_code == 404:
        print('URL {} is broken'.format(url))
        return None

    try:
        return response.json()
    except:
        import ipdb; ipdb.set_trace()


def setup_items():
    json_data = get_api_data(items_url)

    result = []
    for item_id in tqdm(json_data.keys(), desc='Parsing items'):
        data = get_api_data(item_url.format(item_id))
        if data is None:
            continue

        data = data['attributes']

        name = data['name']
        price = int(data['cost'])

        image_name = data['icon']
        image_url = item_image_url.format(image_name)

        image = None
        try:
            image = download_image(image_url, item_image_path, image_name)
        except:
            print('Item image at {} is broken.'.format(image_url))
            continue

        result.append({
            'id': item_id,
            'name': name,
            'image': image,
            'into': [],
            'from': data.get('components', [[]])[0],
            'price': price,
        })

    # verify components
    item_ids = [i['id'] for i in result]

    for r in result:
        for r_from in r['from']:
            if r_from not in item_ids:
                raise Exception(r_from)

    with open('./data/items.json', 'w') as outfile:
        json.dump(result, outfile)

    return result


def setup_champions():
    champions_data = get_api_data(champions_url)

    result = []
    for slug_name, data in tqdm(champions_data.items(), desc='Parsing champions'):
        data = data[list(data.keys())[0]]
        hero_id = data['hero_id']
        name = data['disp_name']

        if data['attacktype'] not in ('melee', 'ranged'):
            raise Exception("Unknown attack type")

        is_range = data['attacktype'] == 'ranged'

        spells = []
        skills_data = get_api_data(champion_url.format(hero_id))
        for spell_id, spell_data in skills_data['abilities'].items():
            spell_identifier = spell_data['cli_ab_name']

            spell_img_url = skill_image_url.format(hero_id, spell_identifier[-1])
            spells.append({
                'id': spell_identifier,
                'name': spell_data['STRINGTABLE']['{}_name'.format(spell_identifier)],
                'image': download_image(
                    spell_img_url,
                    champion_image_path,
                    '{}.png'.format(spell_identifier)
                ),
            })

        champion_img_url = hero_image_url.format(hero_id)
        result.append({
            'id': hero_id,
            'name': name,
            'image': download_image(
                champion_img_url,
                champion_image_path,
                '{}_avatar.png'.format(hero_id)
            ),
            'is_range': is_range,
            'spells': spells,
        })

    with open('./data/champions.json', 'w') as outfile:
        json.dump(result, outfile)

    return result


def setup_settings():
    result = {
        'ads': {
            'ios': {
                'small': 'ca-app-pub-4764697513834958/5819579664',
                'full_screen': 'ca-app-pub-4764697513834958/1249779260',
            },
            'android': {
                'small': 'ca-app-pub-4764697513834958/3145314865',
                'full_screen': 'ca-app-pub-4764697513834958/5959180465',
            },
            'default': {
                'small': 'ca-app-pub-4764697513834958/7883646863',
                'full_screen': 'ca-app-pub-4764697513834958/7744046068',
            },
        },
        'urls': {
            'ios': 'itms-apps://itunes.apple.com/app/id1109019404',
            'android': 'market://details?id=com.YOUR.PACKAGENAME',
            'windows': '',
        },
        'legal_disclaimer': 'This application is not created, sponsored or endorsed by Frostburn Studios and doesn’t reflect the views or opinions of Frostburn Studios or anyone officially involved in producing or managing Heroes of Newerth. Heroes of Newerth is a registered trademark of Frostburn Studios. All in-game descriptions, characters, locations, imagery and videos of game content are copyright and are trademarked to their respective owners. Usage for this game falls within fair use guidelines.',
        'highscore_url': 'http://mobascore-puppybox.rhcloud.com/api/v1/leaderboards/hon/scores/',
    }

    with open('./data/settings.json', 'w') as outfile:
        json.dump(result, outfile)

    return result


def setup_achievements(items, champions):
    item_count = len(list(filter(lambda x: len(x['from']) > 0, items)))
    champion_count = len(champions)
    skill_count = functools.reduce(
        lambda x, y: x + len(y['spells']), champions, 0
    )

    result = [
      {
        "id": "seen_all_skills",
        "name": "Watching your every move",
        "description": "Open all skill levels",
        "type": "array",
        "goal": skill_count,
      },
      {
        "id": "seen_all_items",
        "name": "Recipe observer",
        "description": "Open all recipe levels",
        "type": "array",
        "goal": item_count,
      },
      {
        "id": "seen_all_champions",
        "name": "High Five Everybody",
        "description": "Open all champion levels",
        "type": "array",
        "goal": champion_count,
      },
      {
        "id": "solved_all_skills",
        "name": "Every move is mine",
        "description": "Solve all skill levels",
        "type": "array",
        "goal": skill_count,
      },
      {
        "id": "solved_all_items",
        "name": "Call me blacksmith",
        "description": "Solve all recipe levels",
        "type": "array",
        "goal": item_count,
      },
      {
        "id": "solved_all_champions",
        "name": "I know all of them",
        "description": "Solve all champion levels",
        "type": "array",
        "goal": champion_count,
      },
      {
        "id": "gameplay_small_strike",
        "name": "Warm up",
        "description": "Make a 10x strike",
        "type": "number",
        "goal": 10
      },
      {
        "id": "gameplay_medium_strike",
        "name": "Unstoppable",
        "description": "Make a 50x strike",
        "type": "number",
        "goal": 50
      },
      {
        "id": "gameplay_big_strike",
        "name": "Godlike",
        "description": "Make a 150x strike",
        "type": "number",
        "goal": 150
      },
      {
        "id": "gameplay_small_play_count",
        "name": "Gamer",
        "description": "Play the game 100 times",
        "type": "increment",
        "goal": 100
      },
      {
        "id": "gameplay_medium_play_count",
        "name": "Hardcore gamer",
        "description": "Play the game 250 times",
        "type": "increment",
        "goal": 250
      },
      {
        "id": "gameplay_big_play_count",
        "name": "True fan",
        "description": "Play the game 1000 times",
        "type": "increment",
        "goal": 1000
      },
      {
        "id": "rate_app",
        "name": "Active civic attitude",
        "description": "Rate the application",
        "type": "boolean",
        "goal": 1,
      },
    ]

    with open('./data/achievements.json', 'w') as outfile:
        json.dump(result, outfile)

    return result

items = setup_items()
champions = setup_champions()
setup_achievements(items, champions)
setup_settings()
