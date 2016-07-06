import json
import os
import shutil
import functools

from PIL import Image
import requests
from tqdm import tqdm

item_image_path = './data/images/items/'
champion_image_path = './data/images/champions/'

base_url = 'http://ddragon.leagueoflegends.com/cdn/5.24.2'
items_url = '{}/data/en_US/item.json'.format(base_url)
champions_url = '{}/data/en_US/champion.json'.format(base_url)

os.makedirs(item_image_path, exist_ok=True)
os.makedirs(champion_image_path, exist_ok=True)

def clean_filename(filename):
    return ''.join(filename.split()).lower()


def download_image(url, path, filename):
    response = requests.get(url, stream=True)

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
    for item_id, data in tqdm(json_data['data'].items(), desc='Parsing items'):
        name = data['name']

        if name.startswith('Enchantment'):
            print('Skip {} because of enchantment'.format(name))
            continue

        maps = data['maps']
        if not maps.get('11'):
            print('Skip {} because of invalid map'.format(name))
            continue

        image_name = data['image']['full']
        image_url = '{}/img/item/{}'.format(base_url, image_name)

        result.append({
            'id': item_id,
            'name': name,
            'image': download_image(image_url, item_image_path, image_name),
            'into': data.get('into', []),
            'from': data.get('from', []),
            'price': data['gold']['total'],
        })

    with open('./data/items.json', 'w') as outfile:
        json.dump(result, outfile)

    return result


def setup_champions():
    champion_ids = [ch_id for ch_id in requests.get(champions_url).json()['data'].keys()]

    result = []
    for champion_id in tqdm(champion_ids, desc='Parsing champions'):
        detail_url = '{}/data/en_US/champion/{}.json'.format(base_url, champion_id)
        data = requests.get(detail_url).json()['data'][champion_id]

        image_name = data['image']['full']
        # image_path = os.path.join(champion_image_path, champion_id.lower())
        image_path = champion_image_path
        os.makedirs(image_path, exist_ok=True)

        if champion_id.lower() in ('gnar', 'jayce', 'elise'):
            is_range = None
        else:
            is_range = data['stats']['attackrange'] > 250

        spells = []

        # Add pasive skill
        passive_data = data['passive']
        passive_image = passive_data['image']['full']

        spells.append({
            'id': '{}_passive'.format(champion_id),
            'name': passive_data['name'],
            'image': download_image(
                '{}/img/passive/{}'.format(base_url, passive_image),
                image_path, passive_image
            )
        })

        for spell_data in data['spells']:
            spell_image = spell_data['image']['full']

            spells.append({
                'id': spell_data['id'],
                'name': spell_data['name'],
                'image': download_image(
                    '{}/img/spell/{}'.format(base_url, spell_image),
                    image_path, spell_image
                ),
            })

        small_avatar = '{}_avatar.png'.format(champion_id)

        result.append({
            'id': champion_id,
            'name': data['name'],
            'image': download_image(
                '{}/img/champion/{}'.format(base_url, image_name),
                image_path, small_avatar
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
            'ad_small': 'ca-app-pub-4764697513834958/6693594860',
            'ad_big': 'ca-app-pub-4764697513834958/2123794461',
            'tracking': 'UA-77793311-2',
            'store': 'itms-apps://itunes.apple.com/app/id1107274781',
        },
        'android': {
            'ad_small': 'ca-app-pub-4764697513834958/9308984069',
            'ad_big': 'ca-app-pub-4764697513834958/4599582865',
            'tracking': 'UA-77793311-3',
            'store': 'market://details?id=com.puppybox.quizlol',
        },
        'windows': {
            'ad_small': 'ca-app-pub-4764697513834958/7883646863',
            'ad_big': 'ca-app-pub-4764697513834958/7744046068',
            'tracking': '',
            'store': '',
        },
        'legal_disclaimer': 'This application is not created, sponsored or endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends is a registered trademark of Riot Games. All in-game descriptions, characters, locations, imagery and videos of game content are copyright and are trademarked to their respective owners. Usage for this game falls within fair use guidelines.',
        'highscore_url': 'http://mobascore-puppybox.rhcloud.com/api/v1/leaderboards/lol/scores/',
        'source_name': 'League of Legends',
        'source_url': 'http://leagueoflegends.com/',
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
