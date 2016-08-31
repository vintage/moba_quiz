import json
import os
import shutil
import functools
import re
import time

from PIL import Image
import requests
from tqdm import tqdm
from pyquery import PyQuery as pq


class Hero(object):
    def __init__(self, pk, name, image, title=None, nation=None, tags=None, is_range=None):
        self.pk = pk
        self.name = name
        self.image = image
        self.title = title
        self.is_range = is_range
        self.tags = tags
        self.nation = nation
        self.skills = []

    def __str__(self):
        return json.dumps(self.__dict__)

    def add_skill(self, skill):
        self.skills.append(skill)


class Skill(object):
    def __init__(self, pk, name, image):
        self.pk = pk
        self.name = name
        self.image = image


class Item(object):
    pass


class Importer(object):
    export_path = './data/champions.json'
    image_path = './data/images/champions/'

    def run(self):
        os.makedirs(self.image_path, exist_ok=True)

        objects = self.get_objects()

        self.export(objects)

        return objects

    def get_objects(self):
        return []

    def export(self, data):
        with open(self.export_path, 'w') as outfile:
            json.dump(data, outfile)

            return outfile

    def clean_filename(self, filename):
        return ''.join(filename.split()).lower()

    def download_image(self, url, filename):
        response = requests.get(url, stream=True)

        filename = self.clean_filename(filename)
        full_path = os.path.join(self.image_path, filename)
        with open(full_path, 'wb') as outfile:
            shutil.copyfileobj(response.raw, outfile)

        # compress image
        image = Image.open(full_path)
        image.save(full_path, quality=95, optimize=True)
        del response

        return filename


class HeroImporter(Importer):
    export_path = './data/heroes.json'
    image_path = './data/images/heroes/'

    def get_objects(self):
        list_url = 'http://www.pokemongodb.net/2016/05/pokemon-go-pokedex.html'
        list_dom = pq(url=list_url)

        list_rows = list_dom('.entry-content table').items('tr')

        objects = []
        for _, row in enumerate(tqdm(list_rows, desc='Parsing pokemons')):
            # Skip header row
            if _ == 0:
                continue

            cells = row.find('td')

            pokedex_nb = int(''.join([c for c in cells[0].text if c.isdigit()]))

            types = set()
            for row_link in [a.attr('href') for a in row.items('a')]:
                if '-type-pokemon.html' not in row_link:
                    continue

                raw_type = row_link.split('/')[-1].replace('-type-pokemon.html', '')
                types.add(raw_type[0].upper() + raw_type[1:].lower())
            types = list(types)

            detail_url = cells.eq(2).find('a.in-cell-link').attr('href')
            detail_dom = pq(url=detail_url)

            # Fetch pokemon data
            detail_rows = detail_dom('table').find('tr')

            name = detail_dom.find('h3').text()
            image_url = detail_dom.find('.waffle-image-cell').attr('src')
            image = self.download_image(image_url, 'pok_{}.png'.format(pokedex_nb))
            title = detail_rows.eq(8).find('td').eq(2).text()

            hero = Hero(pokedex_nb, name, image, title, tags=types)

            objects.append(hero)
            print(hero)
            raise Exception

        return objects


class ItemImporter(Importer):
    export_path = './data/items.json'
    image_path = './data/images/items/'

    def get_objects(self):
        return []


def setup_settings():
    result = {
        'ios': {
            'ad_small': 'ca-app-pub-4764697513834958/5120930069',
            'ad_big': 'ca-app-pub-4764697513834958/7934795665',
            'tracking': 'UA-77793311-8',
            'store': 'itms-apps://itunes.apple.com/app/id1121065896',
            'store_premium': 'com.puppybox.quizsmite.premium_version',
        },
        'android': {
            'ad_small': 'ca-app-pub-4764697513834958/5480856869',
            'ad_big': 'ca-app-pub-4764697513834958/5062054468',
            'tracking': 'UA-77793311-9',
            'store': 'market://details?id=com.puppybox.quizsmite',
            'store_premium': 'com.puppybox.quizsmite.premium_version',
        },
        'windows': {
            'ad_small': 'ca-app-pub-4764697513834958/7883646863',
            'ad_big': 'ca-app-pub-4764697513834958/7744046068',
            'tracking': '',
            'store': '',
            'store_premium': '',
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
    ]

    with open('./data/achievements.json', 'w') as outfile:
        json.dump(result, outfile)

    return result

items = ItemImporter().run()
champions = HeroImporter().run()
# setup_achievements(items, champions)
# setup_settings()
