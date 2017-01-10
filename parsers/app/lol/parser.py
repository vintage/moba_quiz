import sys
sys.path.insert(0,'../..')

import requests
from tqdm import tqdm

# Check http://gameinfo.eune.leagueoflegends.com/en/game-info/champions/
# XHR request to get current API version
base_url = 'http://ddragon.leagueoflegends.com/cdn/6.24.1'
base_items_url = base_url + '/data/{}/item.json'
base_champions_url = base_url + '/data/{}/champion.json'

languages_codes = {
    'en': 'en_US',
    'pl': 'pl_PL',
    'pt': 'pt_BR',
    'de': 'de_DE',
    'fr': 'fr_FR',
    'ru': 'ru_RU',
    'es': 'es_ES',
    'tr': 'tr_TR',
    'hu': 'hu_HU',
    'it': 'it_IT',
}

from app import base


class ChampionImporter(base.ChampionImporter):
    def get_objects(self):
        champions_url = base_champions_url.format('en_US')

        champion_ids = [ch_id for ch_id in requests.get(champions_url).json()['data'].keys()]

        objects = []
        for champion_id in tqdm(champion_ids, desc='Parsing champions'):
            i18n = {}
            for lang, code in languages_codes.items():
                url = '{}/data/{}/champion/{}.json'.format(base_url, code, champion_id)

                i18n[lang] = requests.get(url).json()['data'][champion_id]

            detail_url = '{}/data/en_US/champion/{}.json'.format(base_url, champion_id)
            data = requests.get(detail_url).json()['data'][champion_id]

            if champion_id.lower() in ('gnar', 'jayce', 'elise', 'ivern'):
                o_ranged = None
            else:
                o_ranged = data['stats']['attackrange'] > 250

            o_name = data['name']
            o_name_i18n = {k: v['name'] for k, v in i18n.items()}
            o_title = data['title']
            o_title_i18n = {k: v['title'] for k, v in i18n.items()}

            o_image_name = data['image']['full']
            o_image_url = '{}/img/champion/{}'.format(base_url, o_image_name)
            o_image = self.download_image(
                o_image_url, '{}_avatar.png'.format(champion_id)
            )

            champion = base.Champion(champion_id, o_name, o_image, o_title, is_range=o_ranged)
            champion.add_translation('name', o_name_i18n)
            champion.add_translation('title', o_title_i18n)

            # Add passive skill
            passive_data = data['passive']

            s_id = '{}_passive'.format(champion_id)
            s_name = passive_data['name']
            s_name_i18n = {k: v['passive']['name'] for k, v in i18n.items()}
            s_image_url = '{}/img/passive/{}'.format(base_url, passive_data['image']['full'])
            s_image = self.download_image(s_image_url, '{}_passive.png'.format(champion_id))

            skill = base.Skill(s_id, s_name, s_image)
            skill.add_translation('name', s_name_i18n)

            champion.add_skill(skill)

            for index, spell_data in enumerate(data['spells']):
                s_id = spell_data['id']
                s_name = spell_data['name']
                s_name_i18n = {k: v['spells'][index]['name'] for k, v in i18n.items()}
                s_image_url = '{}/img/spell/{}'.format(base_url, spell_data['image']['full'])
                s_image = self.download_image(s_image_url, '{}_{}.png'.format(champion_id, s_id))

                skill = base.Skill(s_id, s_name, s_image)
                skill.add_translation('name', s_name_i18n)

                champion.add_skill(skill)

            objects.append(champion)

        return objects


class ItemImporter(base.ItemImporter):
    def get_objects(self):
        i18n = {}
        for lang, code in languages_codes.items():
            url = base_items_url.format(code)

            i18n[lang] = requests.get(url).json()

        items_url = base_items_url.format('en_US')

        json_data = requests.get(items_url).json()

        objects = []
        for item_id, data in tqdm(json_data['data'].items(), desc='Parsing items'):
            o_name = data['name']
            o_name_i18n = {k: v['data'][item_id]['name'] for k, v in i18n.items()}

            if o_name.startswith('Enchantment'):
                print('Skip {} because of enchantment'.format(o_name))
                continue

            if 'trinket' in o_name.lower():
                print('Skip {} because of trinket type'.format(o_name))
                continue

            maps = data['maps']
            if not maps.get('11'):
                print('Skip {} because of invalid map'.format(o_name))
                continue

            if item_id in ['3043', '3048']:
                continue

            o_price = data['gold']['total']
            if not data['gold']['purchasable']:
                o_price = 0

            o_into = data.get('into', [])
            o_from = data.get('from', [])

            o_image_url = '{}/img/item/{}'.format(base_url, data['image']['full'])
            o_image = self.download_image(
                o_image_url, '{}.png'.format(item_id)
            )

            item = base.Item(item_id, o_name, o_image, o_into, o_from, o_price)
            item.add_translation('name', o_name_i18n)

            objects.append(item)

        return objects


class SettingsImporter(base.SettingsImporter):
    def get_objects(self):
        return {
            'ios': {
                'ad_small': 'ca-app-pub-4764697513834958/6693594860',
                'ad_big': 'ca-app-pub-4764697513834958/2123794461',
                'ad_video_id': '1157886',
                'ad_video_key': '4c0a685045ec2ea625ac4e00bfd52e894e11b90e',
                'tracking': 'UA-77793311-2',
                'store': 'itms-apps://itunes.apple.com/app/id1107274781',
                'store_premium': 'com.puppybox.quizlol.premium_version',
            },
            'android': {
                'ad_small': 'ca-app-pub-4764697513834958/9308984069',
                'ad_big': 'ca-app-pub-4764697513834958/4599582865',
                'ad_video_id': '1157887',
                'ad_video_key': 'a04ae4e3efe676b70a3f19695b0f95b448e7bb8c',
                'ad_id': '660fb73a53929a6171cd4e7c12797fc89bc2b669fff6fc71',
                'tracking': 'UA-77793311-3',
                'store': 'market://details?id=com.puppybox.quizlol',
                'store_premium': 'com.puppybox.quizlol.premium_version',
            },
            'windows': {
                'ad_small': 'ca-app-pub-4764697513834958/7883646863',
                'ad_big': 'ca-app-pub-4764697513834958/7744046068',
                'ad_video_id': '',
                'ad_video_key': '',
                'tracking': '',
                'store': '',
            },
            'legal_disclaimer': 'This application is not created, sponsored or endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends is a registered trademark of Riot Games. All in-game descriptions, characters, locations, imagery and videos of game content are copyright and are trademarked to their respective owners. Usage for this game falls within fair use guidelines.',
            'highscore_url': 'http://mobascore-puppybox.rhcloud.com/api/v1/leaderboards/lol/scores/',
            'source_name': 'League of Legends',
            'source_url': 'http://leagueoflegends.com/',
        }


class AchievementImporter(base.AchievementImporter):
    pass


items = ItemImporter().run()
champions = ChampionImporter().run()
achievements = AchievementImporter(items, champions).run()
settings = SettingsImporter().run()
