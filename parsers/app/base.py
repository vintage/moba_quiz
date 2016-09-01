import json
import os
import shutil
from lxml import html
import requests
from unidecode import unidecode as udecode

from PIL import Image
from tqdm import tqdm


def parse_string(string):
    if string is None:
        return None

    return udecode(string).strip()


class Champion(object):
    def __init__(self, pk, name, image, title=None, kind=None, tags=None, is_range=None):
        self.pk = pk
        self.name = name
        self.image = image
        self.title = title
        self.is_range = is_range
        self.tags = tags
        self.kind = kind
        self.skills = []

    def add_skill(self, skill):
        self.skills.append(skill)

    def to_dict(self):
        return {
            'id': parse_string(self.pk),
            'name': parse_string(self.name),
            'image': parse_string(self.image),
            'type': parse_string(self.kind),

            'title': parse_string(self.title),
            'is_range': self.is_range,
            'tags': [parse_string(t) for t in self.tags],
            'skills': [s.to_dict() for s in self.skills]
        }


class Skill(object):
    def __init__(self, pk, name, image=None, kind=None, value=None):
        self.pk = pk
        self.name = name
        self.image = image
        self.kind = kind
        self.value = value

    def to_dict(self):
        return {
            'id': parse_string(self.pk),
            'name': parse_string(self.name),
            'image': parse_string(self.image),
            'type': parse_string(self.kind),

            'value': parse_string(self.value)
        }


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

    def export(self, objects):
        with open(self.export_path, 'w') as outfile:
            json.dump([o.to_dict() for o in objects], outfile)

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


class ChampionImporter(Importer):
    export_path = './data/champions.json'
    image_path = './data/images/champions/'


class ItemImporter(Importer):
    export_path = './data/items.json'
    image_path = './data/images/items/'

    def get_objects(self):
        return []


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
