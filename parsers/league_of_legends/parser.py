import json
import os
import shutil

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


def download_image(url, path):
    response = requests.get(url, stream=True)
    with open(path, 'wb') as outfile:
        shutil.copyfileobj(response.raw, outfile)

    # compress image
    image = Image.open(path)
    image.save(path, quality=95, optimize=True)
    del response


def setup_items():
    json_data = requests.get(items_url).json()

    result = []
    for item_id, data in tqdm(json_data['data'].items(), desc='Parsing items'):
        name = data['name']

        if name.startswith('Enchantment'):
            continue

        image_name = data['image']['full']

        image_url = '{}/img/item/{}'.format(base_url, image_name)
        download_image(image_url, os.path.join(item_image_path, image_name))

        result.append({
            'id': item_id,
            'name': name,
            'image': image_name,
            'into': data.get('into', []),
            'from': data.get('from', []),
            'price': data['gold']['total'],
        })

    with open('./data/items.json', 'w') as outfile:
        json.dump(result, outfile)


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

        small_avatar = '{}_s_avatar.png'.format(champion_id)
        large_avatar = '{}_l_avatar.png'.format(champion_id)

        download_image(
            '{}/img/champion/{}'.format(base_url, image_name),
            os.path.join(image_path, small_avatar)
        )
        download_image(
            'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/{}_0.jpg'.format(champion_id),
            os.path.join(image_path, large_avatar)
        )

        spells = []

        # Add pasive skill
        passive_data = data['passive']
        passive_image = passive_data['image']['full']
        download_image(
            '{}/img/passive/{}'.format(base_url, passive_image),
            os.path.join(image_path, passive_image)
        )

        spells.append({
            'id': '{}_passive'.format(champion_id),
            'name': passive_data['name'],
            'image': passive_image,
        })

        for spell_data in data['spells']:
            spell_image = spell_data['image']['full']

            download_image(
                '{}/img/spell/{}'.format(base_url, spell_image),
                os.path.join(image_path, spell_image)
            )

            spells.append({
                'id': spell_data['id'],
                'name': spell_data['name'],
                'image': spell_image,
            })

        result.append({
            'id': champion_id,
            'name': data['name'],
            'image': [small_avatar, large_avatar],
            'is_range': is_range,
            'spells': spells,
        })

    with open('./data/champions.json', 'w') as outfile:
        json.dump(result, outfile)


setup_items()
setup_champions()
