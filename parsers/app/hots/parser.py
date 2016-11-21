import json
import os
import shutil
import functools
import re
from lxml import etree

from PIL import Image
import requests
from tqdm import tqdm
from pyquery import PyQuery as pq

item_image_path = './data/images/items/'
champion_image_path = './data/images/champions/'
image_prefix = 'http://us.battle.net/heroes/static'

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
    try:
        image = Image.open(full_path)
    except:
        import ipdb; ipdb.set_trace()
    image.save(full_path, quality=95, optimize=True)
    del response

    return filename


def setup_items():
    # HotS do not support items
    result = []
    with open('./data/items.json', 'w') as outfile:
        json.dump(result, outfile, ensure_ascii=False)

    return result


def setup_champions():
    list_url = 'http://heroesjson.com/heroes.json'
    list_data = requests.get(list_url).json()
    hero_ids = [h['name'] for h in list_data]

    hero_map = {
        'butcher': 'the-butcher',
        # Cho'Gall character
        'cho': 'chogall',
        'gall': 'chogall',
        'li-li': 'lili',
        'liming': 'li-ming',
    }

    result = []
    for hero_id in tqdm(hero_ids, desc='Parsing champions'):
        hero_id = ''.join([h for h in hero_id if h.isalpha() or h == ' '])
        hero_id = hero_id.replace(' ', '-')
        hero_id = hero_id.lower()

        if hero_id in hero_map:
            hero_id = hero_map[hero_id]

        if hero_id in ['chogall', 'greymane']:
            print('Skip {} have no idea how to handle it for now.'.format(hero_id))
            continue

        detail_url = 'http://eu.battle.net/heroes/en/heroes/{}/'.format(hero_id)

        print('Fetching {}'.format(detail_url))

        hero_response = requests.get(detail_url)
        if hero_response.status_code != 200:
            raise Exception('Invalid URL. Update hero_map maybe?')

        tree = etree.HTML(hero_response.content)

        hero_script = tree.xpath('/html/body/div[2]/div/script')[0].text
        start_pos, end_pos = hero_script.find('{'), hero_script.rfind('}')
        hero_json = json.loads(hero_script[start_pos:end_pos + 1])

        name = tree.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div[1]/div[2]/h1')[0].text.strip()
        title = None
        nation = tree.xpath('//*[@id="hero-summary"]/div[2]/div/div[2]')[0].text.strip()
        image_url = '{}{}'.format(
            'http://us.battle.net',
            tree.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div[2]/div[2]/ul/li[1]/img')[0].attrib['src']
        )
        image_name = '{}.jpg'.format(hero_id)
        is_range = hero_json['type']['slug'] != 'melee'

        spells = []
        for ability in hero_json['abilities'] + hero_json['heroicAbilities'] + [hero_json['trait']]:
            skill_image_url = '{}{}'.format(image_prefix, ability['icon'])
            skill_name = ability['name']
            skill_id = '{}_{}'.format(hero_id, ability['slug']).lower()

            spells.append({
                'id': skill_id,
                'name': skill_name,
                'image': download_image(
                    skill_image_url, champion_image_path, '{}.png'.format(skill_id)
                ),
            })

        result.append({
            'id': hero_id,
            'name': name,
            'title': title,
            'nation': nation,
            'image': download_image(
               image_url, champion_image_path, image_name
            ),
            'is_range': is_range,
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
            'store_premium': 'com.puppybox.quizhots.premium_version',
        },
        'android': {
            'ad_small': 'ca-app-pub-4764697513834958/4637657667',
            'ad_big': 'ca-app-pub-4764697513834958/5695588466',
            'ad_video_id': '1197472',
            'ad_video_key': 'a04ae4e3efe676b70a3f19695b0f95b448e7bb8c',
            'tracking': 'UA-77793311-3',
            'store': 'market://details?id=com.puppybox.quizhots',
            'store_premium': 'com.puppybox.quizhots.premium_version',
        },
        'windows': {
            'ad_small': 'ca-app-pub-4764697513834958/7883646863',
            'ad_big': 'ca-app-pub-4764697513834958/7744046068',
            'ad_video_id': '',
            'ad_video_key': '',
            'tracking': '',
            'store': '',
        },
        'legal_disclaimer': 'This application is not created, sponsored or endorsed by Blizzard Entertainment® and doesn’t reflect the views or opinions of Blizzard Entertainment® or anyone officially involved in producing or managing Heroes of the Storm. Heroes of the Storm is a registered trademark of Blizzard Entertainment®. All in-game descriptions, characters, locations, imagery and videos of game content are copyright and are trademarked to their respective owners. Usage for this game falls within fair use guidelines.',
        'highscore_url': 'http://mobascore-puppybox.rhcloud.com/api/v1/leaderboards/hots/scores/',
        'source_name': 'Heroes of the Storm',
        'source_url': 'http://eu.battle.net/heroes/',
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
