import sys
sys.path.insert(0,'../..')

from tqdm import tqdm
import requests

from app import base

base_image_url = 'http://cdn.dota2.com/apps/dota2/images'
base_items_url = 'https://www.dota2.com/jsfeed/heropediadata?feeds=itemdata&l={}'
skills_url = 'http://www.dota2.com/jsfeed/heropediadata?feeds=abilitydata&l=english'
base_champions_url = 'https://www.dota2.com/jsfeed/heropediadata?feeds=herodata&l={}'

languages_codes = {
  'en': 'english',
  'pl': 'polish',
  'pt': 'portuguese',
  'de': 'german',
  'fr': 'french',
  'ru': 'russian',
  'es': 'spanish',
  'tr': 'turkish',
}


class ChampionImporter(base.ChampionImporter):
    def get_objects(self):
        i18n = {}
        for lang, code in languages_codes.items():
            url = base_champions_url.format(code)

            i18n[lang] = requests.get(url).json()

        champions_url = base_champions_url.format('english')

        skills_data = requests.get(skills_url).json()['abilitydata']
        champions_data = requests.get(champions_url).json()['herodata']

        objects = []
        for champion_id, data in tqdm(champions_data.items(), desc='Parsing champions'):
            o_name = data['dname']
            o_name_i18n = {
                k: v['herodata'][champion_id]['dname'] for k, v in i18n.items()
            }
            o_slug = data['u']
            o_ranged = data['dac'] == 'Ranged'

            o_image_url = '{}/heroes/{}_lg.png'.format(base_image_url, champion_id)
            o_image = self.download_image(o_image_url, '{}_avatar.png'.format(champion_id))

            champion = base.Champion(
                champion_id, o_name, o_image, is_range=o_ranged
            )
            champion.add_translation('name', o_name_i18n)

            for spell_id, spell_data in skills_data.items():
                if spell_data['hurl'] != o_slug:
                    continue

                if spell_id in ['invoker_attribute_bonus']:
                    continue

                s_name = spell_data['dname']
                s_image_url = '{}/abilities/{}_hp1.png'.format(base_image_url, spell_id)
                s_image = self.download_image(s_image_url, '{}.png'.format(spell_id))

                skill = base.Skill(spell_id, s_name, s_image)

                champion.add_skill(skill)

            objects.append(champion)

        return objects


class ItemImporter(base.ItemImporter):
    def get_objects(self):
        i18n = {}
        for lang, code in languages_codes.items():
            url = base_items_url.format(code)

            i18n[lang] = requests.get(url).json()

        items_url = base_items_url.format('english')
        json_data = requests.get(items_url).json()

        objects = []

        r_image_url = 'http://cdn.dota2.com/apps/dota2/images/items/recipe_lg.png'
        r_image = self.download_image(r_image_url, 'recipe.png')

        recipe = base.Item('recipe', 'Recipe', r_image, [], [], 0)
        objects.append(recipe)

        price_map = {}
        for item_id, data in tqdm(json_data['itemdata'].items(), desc='Parsing items'):
            # Skip item upgrades like diffusal blade or necronomicon
            if item_id[-1].isdigit():
                continue

            # Skip special items
            if item_id.startswith(('winter_', 'greevil_', 'halloween_', 'mystery_')):
                continue

            if item_id in ('banana',):
                continue

            o_name = data['dname']
            o_name_i18n = {k: v['itemdata'][item_id]['dname'] for k, v in i18n.items()}
            o_price = data['cost']
            o_from = data['components'] or []

            o_image_name = data['img']
            o_image_url = '{}/items/{}'.format(base_image_url, o_image_name)

            try:
                o_image = self.download_image(o_image_url, o_image_name)
            except base.ImageNotFound as e:
                continue

            item = base.Item(item_id, o_name, o_image, [], o_from, o_price)
            item.add_translation('name', o_name_i18n)

            objects.append(item)

            price_map[item_id] = o_price

        # Validate which items need a recipe. Even official https://www.dota2.com
        # page do it like this, have no idea why it's not included in the API.
        # Check in JS BuildItemFullBoxHTML( iData ) function for proof.
        for item in objects:
            total_price = item.price
            component_price = sum([price_map[c] for c in item._from])

            if component_price and total_price > component_price:
                item._from.append('recipe')

        return objects


class SettingsImporter(base.SettingsImporter):
    def get_objects(self):
        return {
            'ios': {
                'ad_small': 'ca-app-pub-4764697513834958/2182670065',
                'ad_big': 'ca-app-pub-4764697513834958/9566336061',
                'ad_video_id': '1157890',
                'ad_video_key': 'db48f588f6aaccc5cee870162cf656d58d308709',
                'tracking': 'UA-77793311-4',
                'store': 'itms-apps://itunes.apple.com/app/id1109010695',
                'store_premium': 'com.puppybox.quizdota.premium_version',
            },
            'android': {
                'ad_small': 'ca-app-pub-4764697513834958/8868332069',
                'ad_big': 'ca-app-pub-4764697513834958/8728731260',
                'ad_video_id': '1157891',
                'ad_video_key': 'b31cc0ddaa08182a6c65e4962e407611a5e7edce',
                'tracking': 'UA-77793311-5',
                'store': 'market://details?id=com.puppybox.quizdota',
                'store_premium': 'com.puppybox.quizdota.premium_version',
            },
            'windows': {
                'ad_small': 'ca-app-pub-4764697513834958/7883646863',
                'ad_big': 'ca-app-pub-4764697513834958/7744046068',
                'ad_video_id': '',
                'ad_video_key': '',
                'tracking': '',
                'store': '',
                'store_premium': '',
            },
            'legal_disclaimer': 'This application is not created, sponsored or endorsed by Valve Corporation and doesn’t reflect the views or opinions of Valve Corporation or anyone officially involved in producing or managing Dota 2. Dota 2 is a registered trademark of Valve Corporation. All in-game descriptions, characters, locations, imagery and videos of game content are copyright and are trademarked to their respective owners. Usage for this game falls within fair use guidelines.',
            'highscore_url': 'http://mobascore-puppybox.rhcloud.com/api/v1/leaderboards/dota/scores/',
            'source_name': 'Dota 2',
            'source_url': 'http://dota2.com/',
        }


class AchievementImporter(base.AchievementImporter):
    pass


items = ItemImporter().run()
champions = ChampionImporter().run()
achievements = AchievementImporter(items, champions).run()
settings = SettingsImporter().run()
