import json
import os
import shutil
import functools
import urllib.request

from PIL import Image
import requests
from tqdm import tqdm
from pyquery import PyQuery as pq

item_image_path = './data/images/items/'
champion_image_path = './data/images/champions/'

items_url = 'http://vainglorydb.com/items'
champions_url = 'http://vainglorydb.com/heroes'

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
    dom = pq(url=items_url)
    container = dom('.items')

    result = []
    for item in tqdm(container.items('li'), desc='Parsing items'):
        detail_url = item.find('a').attr('href')
        detail_dom = pq(url=detail_url)

        data = json.loads(item.attr('data-item'))

        item_id = data['id']
        item_name = data['name']
        item_price = data['cost']

        image_url = data['icon']
        image_name = 'item_{}.png'.format(item_id)

        build_trees = list(detail_dom.items('.build-tree'))

        recipe, max_price = [], 0
        for build_tree in build_trees:
            recipe_items = [
                json.loads(i.attr('data-item')) for i in list(build_tree.items('a'))
            ]

            recipe_ids = [r['id'] for r in recipe_items]
            recipe_price = sum([r['cost'] for r in recipe_items])

            # Skip it as its same item
            if item_id in recipe_ids:
                continue

            if item_price >= recipe_price and recipe_price > max_price:
                max_price = recipe_price
                recipe = recipe_ids

        result.append({
            'id': item_id,
            'name': item_name,
            'image': download_image(image_url, item_image_path, image_name),
            'into': [],
            'from': recipe,
            'price': item_price,
        })

    with open('./data/items.json', 'w') as outfile:
        json.dump(result, outfile, ensure_ascii=False)

    return result


def setup_champions():
    dom = pq(url=champions_url)
    container = dom('.items')

    result = []
    for item in tqdm(container.items('li'), desc='Parsing champions'):
        detail_url = item.find('a').attr('href')
        detail_dom = pq(url=detail_url)

        champion_name = detail_dom.find('.section-head a').text()
        champion_id = champion_name.lower()
        champion_ranged = detail_dom('.basic-panel .basic-table tr').eq(0).find('td').eq(1).text()
        champion_nation = detail_dom('.basic-panel .basic-table tr').eq(2).find('td').eq(1).text()

        image_url = 'http://www.vaingloryfire.com/images/wikibase/icon/heroes/{}.png'.format(champion_id)

        image_name = 'hero_{}.png'.format(champion_id)

        skill_nodes = list(detail_dom.find('#hero-abilities').items('li'))

        spells = []
        for skill_node in skill_nodes:
            skill = json.loads(skill_node.attr('data-ability'))

            skill_name = skill['name']
            skill_id = skill['id']
            skill_image_url = skill['icon']
            skill_image_name = 'skill_{}.png'.format(skill_id)

            spells.append({
                'id': skill_id,
                'name': skill_name,
                'image': download_image(
                    skill_image_url, champion_image_path, skill_image_name
                ),
            })

        result.append({
            'id': champion_id,
            'name': champion_name,
            'nation': champion_nation,
            'image': download_image(
               image_url, champion_image_path, image_name
            ),
            'is_range': champion_ranged.lower() == 'ranged',
            'spells': spells,
        })

    with open('./data/champions.json', 'w') as outfile:
        json.dump(result, outfile, ensure_ascii=False)

    return result


def setup_settings():
    result = {
        'ios': {
            'ad_small': 'ca-app-pub-4764697513834958/6893120062',
            'ad_big': 'ca-app-pub-4764697513834958/2183718861',
            'ad_video_id': '1197471',
            'ad_video_key': '4c0a685045ec2ea625ac4e00bfd52e894e11b90e',
            'tracking': 'UA-77793311-2',
            'store': 'itms-apps://itunes.apple.com/app/id1175817991',
            'store_premium': 'com.puppybox.quizvg.premium_version',
        },
        'android': {
            'ad_small': 'ca-app-pub-4764697513834958/4637657667',
            'ad_big': 'ca-app-pub-4764697513834958/5695588466',
            'ad_video_id': '1197472',
            'ad_video_key': 'a04ae4e3efe676b70a3f19695b0f95b448e7bb8c',
            'tracking': 'UA-77793311-3',
            'store': 'market://details?id=com.puppybox.quizvg',
            'store_premium': 'com.puppybox.quizvg.premium_version',
        },
        'windows': {
            'ad_small': 'ca-app-pub-4764697513834958/7883646863',
            'ad_big': 'ca-app-pub-4764697513834958/7744046068',
            'ad_video_id': '',
            'ad_video_key': '',
            'tracking': '',
            'store': '',
        },
        'legal_disclaimer': 'This application is not created, sponsored or endorsed by Super Evil Megacorp and doesn’t reflect the views or opinions of Super Evil Megacorp or anyone officially involved in producing or managing Vainglory. Vainglory is a registered trademark of Super Evil Megacorp. All in-game descriptions, characters, locations, imagery and videos of game content are copyright and are trademarked to their respective owners. Usage for this game falls within fair use guidelines.',
        'highscore_url': 'http://mobascore-puppybox.rhcloud.com/api/v1/leaderboards/vg/scores/',
        'source_name': 'Vainglory',
        'source_url': 'http://www.vainglorygame.com/',
    }

    with open('./data/settings.json', 'w') as outfile:
        json.dump(result, outfile, ensure_ascii=False)

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
        json.dump(result, outfile, ensure_ascii=False)

    return result

items = setup_items()
champions = setup_champions()
setup_achievements(items, champions)
setup_settings()
