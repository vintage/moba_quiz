import json
import os
import shutil
import functools

from PIL import Image
import requests
from tqdm import tqdm
from pyquery import PyQuery as pq


item_image_path = './data/images/items/'
champion_image_path = './data/images/champions/'

items_url = 'https://www.smitegame.com/items/'
champions_url = 'https://www.smitegame.com/gods/'

os.makedirs(item_image_path, exist_ok=True)
os.makedirs(champion_image_path, exist_ok=True)

def clean_filename(filename):
    return ''.join(filename.split()).lower().replace('(passive)', '')


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
    dom = pq(url=items_url)
    container = dom('.god-container')

    result = []
    for item in tqdm(container.items('.item-package'), desc='Parsing items'):
        name = item.find('.title').text()
        price = int(item.find('.cost').text())

        image_url = item.find('img.icon').attr('src')
        image_name = image_url.split('/')[-1]

        result.append({
            'id': name.lower(),
            'name': name,
            'image': download_image(image_url, item_image_path, image_name),
            'into': [],
            'from': [],
            'price': price,
        })

    with open('./data/items.json', 'w') as outfile:
        json.dump(result, outfile)

    return result


def setup_champions():
    dom = pq(url=champions_url)
    container = dom('.god-container')

    result = []
    for item in tqdm(container.items('.god-package'), desc='Parsing champions'):
        detail_url = item.find('a').attr('href')

        name = item.find('.god-name').text()

        image_url = item.find('img.icon').attr('src')
        image_name = '{}.png'.format(name).lower()

        detail_dom = pq(url=detail_url)

        is_range = True

        image_path = champion_image_path
        os.makedirs(image_path, exist_ok=True)

        spells = []
        for spell_dom in detail_dom.items('.single-ability'):
            skill_image_url = spell_dom.find('img.icon').attr('src')
            skill_name = spell_dom.find('.ability-name').text()
            skill_id = '{}_{}'.format(name, skill_name).lower()

            spells.append({
                'id': skill_id,
                'name': skill_name,
                'image': download_image(
                    skill_image_url, image_path, '{}.png'.format(skill_id)
                ),
            })

        result.append({
            'id': name.lower(),
            'name': name,
            'image': download_image(
               image_url, image_path, image_name
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
                'small': 'ca-app-pub-4764697513834958/5120930069',
                'full_screen': 'ca-app-pub-4764697513834958/7934795665',
            },
            'android': {
                'small': 'ca-app-pub-4764697513834958/5480856869',
                'full_screen': 'ca-app-pub-4764697513834958/5062054468',
            },
            'default': {
                'small': 'ca-app-pub-4764697513834958/7883646863',
                'full_screen': 'ca-app-pub-4764697513834958/7744046068',
            },
        },
        'urls': {
            'ios': 'itms-apps://itunes.apple.com/app/id1121065896',
            'android': 'market://details?id=com.puppybox.quizsmite',
            'windows': '',
        },
        'legal_disclaimer': 'This application is not created, sponsored or endorsed by Hi-Rez Studios and doesn’t reflect the views or opinions of Hi-Rez Studios or anyone officially involved in producing or managing SMITE. SMITE is a registered trademark of Hi-Rez Studios. All in-game descriptions, characters, locations, imagery and videos of game content are copyright and are trademarked to their respective owners. Usage for this game falls within fair use guidelines.',
        'highscore_url': 'http://mobascore-puppybox.rhcloud.com/api/v1/leaderboards/smite/scores/',
        'source_name': 'SMITE',
        'source_url': 'http://smitegame.com/',
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
