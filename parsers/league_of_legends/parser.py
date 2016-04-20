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
        "name": "All your skill are belong to us",
        "description": "Match all skills with their champions",
        "type": "array",
        "goal": skill_count,
      },
      {
        "id": "solved_all_items",
        "name": "Call me master of crafting",
        "description": "Answer all recipe-based questions",
        "type": "array",
        "goal": item_count,
      },
      {
        "id": "solved_all_champions",
        "name": "Yes I know all of them",
        "description": "Match all champions with their skills",
        "type": "array",
        "goal": champion_count,
      },
    #   {
    #     "id": "highscore_daily",
    #     "name": "First step to fame",
    #     "description": "Get a score in the daily highscore",
    #     "type": "boolean",
    #     "goal": 1,
    #   },
    #   {
    #     "id": "highscore_weekly",
    #     "name": "Am I famous already?",
    #     "description": "Get a score in the weekly highscore",
    #     "type": "boolean",
    #     "goal": 1,
    #   },
    #   {
    #     "id": "highscore_monthly",
    #     "name": "Hall of Fame",
    #     "description": "Get a score in the montly highscore",
    #     "type": "boolean",
    #     "goal": 1,
    #   },
    #   {
    #     "id": "highscore_best_daily",
    #     "name": "Fame of the day",
    #     "description": "Be the number one in the daily highscore",
    #     "type": "boolean",
    #     "goal": 1,
    #   },
      {
        "id": "gameplay_small_strike",
        "name": "Warm up",
        "description": "Answer perfectly 10 questions in a row",
        "type": "number",
        "goal": 10
      },
      {
        "id": "gameplay_medium_strike",
        "name": "Unstoppable",
        "description": "Answer perfectly 50 questions in a row",
        "type": "number",
        "goal": 50
      },
      {
        "id": "gameplay_big_strike",
        "name": "Godlike",
        "description": "Answer perfectly 150 questions in a row",
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
