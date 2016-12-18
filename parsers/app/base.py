import json
import os
import shutil
import functools
import re

import requests
from unidecode import unidecode as udecode
from PIL import Image
from slugify import slugify


class ImageNotFound(Exception):
    pass


def parse_string(string):
    if string is None:
        return None

    return string.strip()


class Champion(object):
    def __init__(self, pk, name, image, title=None, is_range=None, nation=None):
        self.pk = pk
        self.name = name
        self.image = image
        self.title = title
        self.is_range = is_range
        self.nation = nation
        self.skills = []
        self.translations = {}

    def add_skill(self, skill):
        self.skills.append(skill)

    def add_translation(self, field, value):
        self.translations[field] = value

    def to_dict(self):
        data = {
            'id': parse_string(self.pk),
            'name': parse_string(self.name),
            'nation': parse_string(self.nation),
            'image': parse_string(self.image),
            'title': parse_string(self.title),
            'is_range': self.is_range,
            'skills': [s.to_dict() for s in self.skills]
        }

        for i18n_key, i18n_value in self.translations.items():
            data['{}_i18n'.format(i18n_key)] = i18n_value

        return data


class Skill(object):
    def __init__(self, pk, name, image):
        self.pk = pk
        self.name = name
        self.image = image
        self.translations = {}

    def add_translation(self, field, value):
        self.translations[field] = value

    def to_dict(self):
        data = {
            'id': parse_string(self.pk),
            'name': parse_string(self.name),
            'image': parse_string(self.image),
        }

        for i18n_key, i18n_value in self.translations.items():
            data['{}_i18n'.format(i18n_key)] = i18n_value

        return data


class Item(object):
    def __init__(self, pk, name, image, into, _from, price):
        self.pk = pk
        self.name = name
        self.image = image
        self.into = into
        self._from = _from
        self.price = price
        self.translations = {}

    def add_translation(self, field, value):
        self.translations[field] = value

    def to_dict(self):
        data = {
            'id': parse_string(self.pk),
            'name': parse_string(self.name),
            'image': parse_string(self.image),
            'into': self.into,
            'from': self._from,
            'price': self.price,
        }

        for i18n_key, i18n_value in self.translations.items():
            data['{}_i18n'.format(i18n_key)] = i18n_value

        return data


class Importer(object):
    export_path = './data/champions.json'
    image_path = './data/images/champions/'

    def run(self):
        os.makedirs(self.image_path, exist_ok=True)

        objects = self.get_objects()

        try:
          is_valid = self.validate(objects)
        except Exception as e:
          import ipdb; ipdb.set_trace()
          raise
        if not is_valid:
            raise Exception('Something went wrong in the validate method.')

        self.export(objects)

        return objects

    def get_objects(self):
        return []

    def export(self, objects):
        with open(self.export_path, 'w') as outfile:
            json.dump([o.to_dict() for o in objects], outfile, ensure_ascii=False)

            return outfile

    def slugify(self, value):
        return slugify(value)

    def clean_filename(self, filename):
        filename = udecode(''.join(filename.split()).lower())
        extension_dot = filename.rindex('.')

        left_part = filename[:extension_dot]
        right_part = filename[extension_dot:]
        # Characters after last . can be [a-z] only
        right_part = " ".join(re.findall("[a-zA-Z]+", right_part))

        return "{}.{}".format(left_part, right_part)

    def download_image(self, url, filename):
        response = requests.get(url, stream=True)

        if response.status_code != 200:
            msg = 'Image at {} not found'.format(url)
            print(msg)
            raise ImageNotFound(msg)

        filename = self.clean_filename(filename)
        full_path = os.path.join(self.image_path, filename)
        with open(full_path, 'wb') as outfile:
            shutil.copyfileobj(response.raw, outfile)

        # compress image
        image = Image.open(full_path)
        image.save(full_path, quality=95, optimize=True)
        del response

        return filename

    def validate(self, objects):
        return True


class ChampionImporter(Importer):
    export_path = './data/champions.json'
    image_path = './data/images/champions/'

    def validate(self, objects):
        for obj in objects:
            # Validate basic fields
            if not any([obj.pk, obj.name, obj.image]):
                raise Exception('Champion {} missing fields.'.format(obj.pk))

            # Validate skills
            skills = obj.skills
            if not skills:
                raise Exception('Champion {} missing skills.'.format(obj.pk))

            for skill in skills:
                if not any([skill.pk, skill.name, skill.image]):
                    raise Exception('Champion {} skill {} missing fields'.format(
                        obj.pk, skill.pk
                    ))

        return True


class ItemImporter(Importer):
    export_path = './data/items.json'
    image_path = './data/images/items/'

    def get_objects(self):
        return []

    def validate(self, objects):
        flat_ids = set([i.pk for i in objects])
        for obj in objects:
            # Validate basic fields
            if not any([obj.pk, obj.name, obj.image]):
                raise Exception('Item {} missing fields.'.format(obj.pk))

            # Validate recipe
            components = obj._from

            if not components:
                continue

            if not set(components).issubset(flat_ids):
                raise Exception('Item {} contains invalid recipe: {}'.format(
                    obj.pk, components
                ))

        return True


class SettingsImporter(Importer):
    export_path = './data/settings.json'

    def export(self, objects):
        with open(self.export_path, 'w') as outfile:
            json.dump(objects, outfile)

            return outfile

    def get_objects(self):
        return {
            'ios': {
                'ad_small': 'ca-app-pub-4764697513834958/5120930069',
                'ad_big': 'ca-app-pub-4764697513834958/7934795665',
                'tracking': 'UA-77793311-8',
                'store': 'itms-apps://itunes.apple.com/app/id1121065896',
                'store_premium': 'com.puppybox.quizpokemon.premium_version',
            },
            'android': {
                'ad_small': 'ca-app-pub-4764697513834958/5480856869',
                'ad_big': 'ca-app-pub-4764697513834958/5062054468',
                'tracking': 'UA-77793311-9',
                'store': 'market://details?id=com.puppybox.quizpokemon',
                'store_premium': 'com.puppybox.quizpokemon.premium_version',
            },
            'windows': {
                'ad_small': 'ca-app-pub-4764697513834958/7883646863',
                'ad_big': 'ca-app-pub-4764697513834958/7744046068',
                'tracking': '',
                'store': '',
                'store_premium': '',
            },
            'legal_disclaimer': 'This application is not created, sponsored or endorsed by Niantic and doesn’t reflect the views or opinions of Niantic or anyone officially involved in producing or managing Pokemon GO. Pokemon GO is a registered trademark of Niantic. All in-game characters, locations, imagery and videos of game content are copyright and are trademarked to their respective owners. Usage for this game falls within fair use guidelines.',
            'highscore_url': 'http://mobascore-puppybox.rhcloud.com/api/v1/leaderboards/pokemon/scores/',
            'source_name': 'Pokemon GO',
            'source_url': 'http://www.pokemongo.com/',
        }


class AchievementImporter(Importer):
    export_path = './data/achievements.json'

    def __init__(self, items, champions):
        self.items = items
        self.champions = champions

    def export(self, objects):
        with open(self.export_path, 'w') as outfile:
            json.dump(objects, outfile)

            return outfile

    def get_objects(self):
        items = self.items
        champions = self.champions

        item_count = len(list(filter(lambda x: len(x._from) > 0, items)))
        champion_count = len(champions)
        skill_count = functools.reduce(
            lambda x, y: x + len(y.skills), champions, 0
        )

        objects = [
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

        return objects
