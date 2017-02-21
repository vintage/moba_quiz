import sys
sys.path.insert(0,'../..')

import time
import requests

from tqdm import tqdm

from app import base

hero_image_url = 'https://www.heroesofnewerth.com/images/heroes/{}/icon_128.jpg'
skill_image_url = 'https://www.heroesofnewerth.com/images/heroes/{}/ability{}_128.jpg'
item_image_url = 'https://www.heroesofnewerth.com/images/items/{}'

items_url = 'http://api.heroesofnewerth.com/items/all/?token=6V2D6Z89U8ZZWIVN'
item_url = 'http://api.heroesofnewerth.com/items/name/{}/?token=6V2D6Z89U8ZZWIVN'

champions_url = 'http://api.heroesofnewerth.com/heroes/all?token=6V2D6Z89U8ZZWIVN'
champion_url = 'http://api.heroesofnewerth.com/heroes/id/{}/?token=6V2D6Z89U8ZZWIVN'


def get_api_data(url):
    response = requests.get(url)
    while response.status_code == 429:
        print('Too many requests. Go sleep and try again.')
        time.sleep(1)
        response = requests.get(url)

    if response.status_code == 404:
        print('URL {} is broken'.format(url))
        return None

    return response.json()


class ChampionImporter(base.ChampionImporter):
    def get_objects(self):
        champions_data = get_api_data(champions_url)

        objects = []
        for slug_name, data in tqdm(champions_data.items(), desc='Parsing champions'):
            data = data[list(data.keys())[0]]
            o_id = data['hero_id']
            o_name = data['disp_name']

            if data['attacktype'] not in ('melee', 'ranged'):
                raise Exception("Unknown attack type")

            o_ranged = data['attacktype'] == 'ranged'

            o_image_url = hero_image_url.format(o_id)
            o_image = self.download_image(o_image_url, '{}_avatar.png'.format(o_id))

            champion = base.Champion(
                o_id, o_name, o_image, is_range=o_ranged,
            )

            skills_data = get_api_data(champion_url.format(o_id))
            for spell_id, spell_data in skills_data['abilities'].items():
                s_id = spell_data['cli_ab_name']
                s_name = spell_data['STRINGTABLE']['{}_name'.format(s_id)]

                s_image_url = skill_image_url.format(o_id, s_id[-1])
                s_image = self.download_image(s_image_url, '{}.png'.format(s_id))

                skill = base.Skill(s_id, s_name, s_image)

                champion.add_skill(skill)

            objects.append(champion)

        return objects


class ItemImporter(base.ItemImporter):
    def get_objects(self):
        json_data = get_api_data(items_url)

        objects = []
        for item_id in tqdm(json_data.keys(), desc='Parsing items'):
            data = get_api_data(item_url.format(item_id))
            if data is None:
                continue

            data = data['attributes']

            o_name = data['name']
            o_price = int(data['cost'])
            o_from = data.get('components', [[]])[0]

            o_image_url = item_image_url.format(data['icon'])

            try:
                o_image = self.download_image(o_image_url, '{}.png'.format(item_id))
            except:
                print('Item image at {} is broken.'.format(o_image_url))
                continue

            item = base.Item(item_id, o_name, o_image, [], o_from, o_price)

            objects.append(item)

        return objects


class SettingsImporter(base.SettingsImporter):
    def get_objects(self):
        return {
            'ios': {
                'ad_banner': 'ca-app-pub-4764697513834958/5819579664',
                'ad_interstitial': 'ca-app-pub-4764697513834958/1249779260',
                'ad_reward': 'ca-app-pub-4764697513834958/5139495269',
                'tracking': 'UA-77793311-6',
                'store': 'itms-apps://itunes.apple.com/app/id1109019404',
                'store_premium': 'com.puppybox.quizhon.premium_version',
            },
            'android': {
                'ad_banner': 'ca-app-pub-4764697513834958/3145314865',
                'ad_interstitial': 'ca-app-pub-4764697513834958/5959180465',
                'ad_reward': 'ca-app-pub-4764697513834958/7035030866',
                'tracking': 'UA-77793311-7',
                'store': 'market://details?id=com.puppybox.quizhon',
                'store_premium': 'com.puppybox.quizhon.premium_version',
            },
            'legal_disclaimer': 'This application is not created, sponsored or endorsed by Frostburn Studios and doesn’t reflect the views or opinions of Frostburn Studios or anyone officially involved in producing or managing Heroes of Newerth. Heroes of Newerth is a registered trademark of Frostburn Studios. All in-game descriptions, characters, locations, imagery and videos of game content are copyright and are trademarked to their respective owners. Usage for this game falls within fair use guidelines.',
            'highscore_url': 'http://mobascore-puppybox.rhcloud.com/api/v1/leaderboards/hon/scores/',
            'source_name': 'Heroes of Newerth',
            'source_url': 'http://www.heroesofnewerth.com/',
        }


class AchievementImporter(base.AchievementImporter):
    pass


items = ItemImporter().run()
champions = ChampionImporter().run()
achievements = AchievementImporter(items, champions).run()
settings = SettingsImporter().run()
