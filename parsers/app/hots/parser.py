import sys
sys.path.insert(0,'../..')

import json

import requests
from tqdm import tqdm
from lxml import etree

from app import base

heroes_url = 'http://heroesjson.com/heroes.json'
image_prefix = 'http://us.battle.net/heroes/static'


class ChampionImporter(base.ChampionImporter):
    def get_objects(self):
        list_data = requests.get(heroes_url).json()
        hero_ids = [h['name'] for h in list_data]

        hero_map = {
            'butcher': 'the-butcher',
            # Cho'Gall character
            'cho': 'chogall',
            'gall': 'chogall',
            'li-li': 'lili',
            'liming': 'li-ming',
        }

        objects = []
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

            hero_response = requests.get(detail_url)
            if hero_response.status_code != 200:
                raise Exception('Invalid URL. Update hero_map maybe?')

            tree = etree.HTML(hero_response.content)

            hero_script = tree.xpath('/html/body/div[2]/div/script')[0].text
            start_pos, end_pos = hero_script.find('{'), hero_script.rfind('}')
            hero_json = json.loads(hero_script[start_pos:end_pos + 1])

            o_name = tree.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div[1]/div[2]/h1')[0].text.strip()
            o_title = None
            o_nation = tree.xpath('//*[@id="hero-summary"]/div[2]/div/div[2]')[0].text.strip()
            o_ranged = hero_json['type']['slug'] != 'melee'

            o_image_url = '{}{}'.format(
                'http://us.battle.net',
                tree.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div[2]/div[2]/ul/li[1]/img')[0].attrib['src']
            )
            o_image = self.download_image(o_image_url, '{}.jpg'.format(hero_id))

            champion = base.Champion(
                hero_id, o_name, o_image, o_title, is_range=o_ranged, nation=o_nation
            )

            for ability in hero_json['abilities'] + hero_json['heroicAbilities'] + [hero_json['trait']]:
                s_id = '{}_{}'.format(hero_id, ability['slug']).lower()
                s_name = ability['name']

                s_image_url = '{}{}'.format(image_prefix, ability['icon'])
                s_image = self.download_image(s_image_url, '{}_{}.png'.format(
                    hero_id, s_id
                ))

                skill = base.Skill(s_id, s_name, s_image)
                champion.add_skill(skill)

            objects.append(champion)

        return objects


class ItemImporter(base.ItemImporter):
    def get_objects(self):
        return []


class SettingsImporter(base.SettingsImporter):
    def get_objects(self):
        return {
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


class AchievementImporter(base.AchievementImporter):
    pass


items = ItemImporter().run()
champions = ChampionImporter().run()
achievements = AchievementImporter(items, champions).run()
settings = SettingsImporter().run()
