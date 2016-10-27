import json
import os
import shutil
import functools
import re

from PIL import Image
import requests
from tqdm import tqdm

item_image_path = './data/images/items/'
champion_image_path = './data/images/champions/'

base_image_url = 'http://cdn.dota2.com/apps/dota2/images'
items_url = 'https://www.dota2.com/jsfeed/heropediadata?feeds=itemdata&l=english'
skills_url = 'http://www.dota2.com/jsfeed/heropediadata?feeds=abilitydata&l=english'
champions_url = 'https://www.dota2.com/jsfeed/heropediadata?feeds=herodata&l=english'

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


def setup_items():
    json_data = requests.get(items_url).json()

    result = []
    recipe_image_url = 'http://cdn.dota2.com/apps/dota2/images/items/recipe_lg.png'
    result.append({
        'id': 'recipe',
        'name': 'Recipe',
        'image': download_image(recipe_image_url, item_image_path, 'recipe.png'),
        'into': [],
        'from': [],
        'price': 0,
    })
    price_map = {}
    for item_id, data in tqdm(json_data['itemdata'].items(), desc='Parsing items'):
        # Skip item upgrades like diffusal blade or necronomicon
        if item_id[-1].isdigit():
            continue

        # Skip special items
        if item_id.startswith(('winter_', 'greevil_', 'halloween_', 'mystery_')):
            continue

        if item_id in ('banana',):
            continue

        name = data['dname']
        price = data['cost']

        image_name = data['img']
        image_url = '{}/items/{}'.format(base_image_url, image_name)

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
            'from': data['components'] or [],
            'price': price,
        })

        price_map[item_id] = price

    # Validate which items need a recipe. Even official https://www.dota2.com
    # page do it like this, have no idea why it's not included in the API.
    # Check in JS BuildItemFullBoxHTML( iData ) function for proof.
    for item in result:
        total_price = item['price']
        component_price = sum([price_map[c] for c in item['from']])

        if component_price and total_price > component_price:
            item['from'].append('recipe')

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
    skills_data = requests.get(skills_url).json()['abilitydata']
    champions_data = requests.get(champions_url).json()['herodata']

    result = []
    for champion_id, data in tqdm(champions_data.items(), desc='Parsing champions'):
        name = data['dname']
        slug_name = data['u']
        is_range = data['dac'] == 'Ranged'

        spells = []
        for spell_id, spell_data in skills_data.items():
            if spell_data['hurl'] != slug_name:
                continue

            if spell_id in ['invoker_attribute_bonus']:
                continue

            spell_img_url = '{}/abilities/{}_hp1.png'.format(base_image_url, spell_id)
            spells.append({
                'id': spell_id,
                'name': spell_data['dname'],
                'image': download_image(
                    spell_img_url,
                    champion_image_path,
                    '{}.png'.format(spell_id)
                ),
            })

        champion_img_url = '{}/heroes/{}_lg.png'.format(base_image_url, champion_id)
        result.append({
            'id': champion_id,
            'name': name,
            'image': download_image(
                champion_img_url,
                champion_image_path,
                '{}_avatar.png'.format(champion_id)
            ),
            'is_range': is_range,
            'spells': spells,
        })

    with open('./data/champions.json', 'w') as outfile:
        json.dump(result, outfile)

    return result


def setup_settings():
    result = {
        'ios': {
            'ad_small': 'ca-app-pub-4764697513834958/2182670065',
            'ad_big': 'ca-app-pub-4764697513834958/9566336061',
            'ad_video_id': '1157890',
            'ad_video_key': 'db48f588f6aaccc5cee870162cf656d58d308709',
            'tracking': 'UA-77793311-4',
            'store': 'itms-apps://itunes.apple.com/app/id1109010695',
            'store_premium': 'com.puppybox.quizdota.premium_version',
        },
        'android': {
            'ad_small': 'ca-app-pub-4764697513834958/8868332069',
            'ad_big': 'ca-app-pub-4764697513834958/8728731260',
            'ad_video_id': '1157891',
            'ad_video_key': 'b31cc0ddaa08182a6c65e4962e407611a5e7edce',
            'tracking': 'UA-77793311-5',
            'store': 'market://details?id=com.puppybox.quizdota',
            'store_premium': 'com.puppybox.quizdota.premium_version',
        },
        'windows': {
            'ad_small': 'ca-app-pub-4764697513834958/7883646863',
            'ad_big': 'ca-app-pub-4764697513834958/7744046068',
            'ad_video_id': '',
            'ad_video_key': '',
            'tracking': '',
            'store': '',
            'store_premium': '',
        },
        'legal_disclaimer': 'This application is not created, sponsored or endorsed by Valve Corporation and doesn’t reflect the views or opinions of Valve Corporation or anyone officially involved in producing or managing Dota 2. Dota 2 is a registered trademark of Valve Corporation. All in-game descriptions, characters, locations, imagery and videos of game content are copyright and are trademarked to their respective owners. Usage for this game falls within fair use guidelines.',
        'highscore_url': 'http://mobascore-puppybox.rhcloud.com/api/v1/leaderboards/dota/scores/',
        'source_name': 'Dota 2',
        'source_url': 'http://dota2.com/',
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
    ]

    with open('./data/achievements.json', 'w') as outfile:
        json.dump(result, outfile)

    return result

items = setup_items()
champions = setup_champions()
setup_achievements(items, champions)
setup_settings()
