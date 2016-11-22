import sys
sys.path.insert(0,'../..')

import time

from tqdm import tqdm
from pyquery import PyQuery as pq

from app import base

items_url = 'https://www.smitegame.com/items/'
champions_url = 'https://www.smitegame.com/gods/'


class ChampionImporter(base.ChampionImporter):
    def get_objects(self):
        dom = pq(url=champions_url)
        container = dom('.god-container')

        god_rows = pq(url='http://smite.gamepedia.com/List_of_gods').items('table tr')

        objects = []
        for item in tqdm(container.items('.god-package'), desc='Parsing champions'):
            detail_url = item.find('a').attr('href')

            try:
                detail_dom = pq(url=detail_url)
            except:
                time.sleep(1)
                detail_dom = pq(url=detail_url)

            o_name = item.find('.god-name').text()
            o_id = o_name.lower()
            o_title = detail_dom.find('.god-info .title').text()
            o_ranged = None
            o_nation = None

            for row in god_rows:
                cells = row.find('td')
                if not cells:
                    continue

                name_cell = cells[1]

                if name_cell.text_content().strip().lower() == o_id.lower():
                    o_ranged = cells[3].text_content().strip() == 'Ranged'
                    o_nation = cells[2].text_content().strip()
                    break

            if o_ranged is None:
                raise Exception('Invalid `is_range` option.')

            # ullr is both melee & range
            if o_id == 'ullr':
                o_ranged = None

            o_image_url = item.find('img.icon').attr('src')
            o_image_name = '{}.png'.format(o_id)
            o_image = self.download_image(o_image_url, o_image_name)

            champion = base.Champion(
                o_id, o_name, o_image, o_title, is_range=o_ranged, nation=o_nation
            )

            for spell_dom in detail_dom.items('.single-ability'):
                s_name = spell_dom.find('.ability-name').text()
                s_id = '{}_{}'.format(o_id, s_name).lower()

                s_image_url = spell_dom.find('img.icon').attr('src')
                s_image = self.download_image(s_image_url, '{}.png'.format(s_id))

                skill = base.Skill(s_id, s_name, s_image)

                champion.add_skill(skill)

            objects.append(champion)

        return objects


class ItemImporter(base.ItemImporter):
    def get_objects(self):
        dom = pq(url=items_url)
        container = dom('.god-container')

        objects = []
        for item in tqdm(container.items('.item-package'), desc='Parsing items'):
            o_name = item.find('.title').text()
            o_id = o_name.lower()
            o_price = int(item.find('.cost').text())
            o_from = item.find('.starting-item-name').text()

            # For SMITE we want to import only base items (tier 1)
            if o_name not in o_from:
                continue

            o_image_url = item.find('img.icon').attr('src')
            o_image_name = o_image_url.split('/')[-1]
            o_image = self.download_image(o_image_url, o_image_name)

            item = base.Item(o_id, o_name, o_image, [], [], o_price)

            objects.append(item)

        return objects


class SettingsImporter(base.SettingsImporter):
    def get_objects(self):
        return {
            'ios': {
                'ad_small': 'ca-app-pub-4764697513834958/5120930069',
                'ad_big': 'ca-app-pub-4764697513834958/7934795665',
                'ad_video_id': '1157888',
                'ad_video_key': '893a78e3ba345e0e38e78418173e44fd988e9ed7',
                'tracking': 'UA-77793311-8',
                'store': 'itms-apps://itunes.apple.com/app/id1121065896',
                'store_premium': 'com.puppybox.quizsmite.premium_version',
            },
            'android': {
                'ad_small': 'ca-app-pub-4764697513834958/5480856869',
                'ad_big': 'ca-app-pub-4764697513834958/5062054468',
                'ad_video_id': '1157889',
                'ad_video_key': 'e88ff04fde322e96808f6350e707775d4027bd7a',
                'tracking': 'UA-77793311-9',
                'store': 'market://details?id=com.puppybox.quizsmite',
                'store_premium': 'com.puppybox.quizsmite.premium_version',
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
            'legal_disclaimer': 'This application is not created, sponsored or endorsed by Hi-Rez Studios and doesn’t reflect the views or opinions of Hi-Rez Studios or anyone officially involved in producing or managing SMITE. SMITE is a registered trademark of Hi-Rez Studios. All in-game descriptions, characters, locations, imagery and videos of game content are copyright and are trademarked to their respective owners. Usage for this game falls within fair use guidelines.',
            'highscore_url': 'http://mobascore-puppybox.rhcloud.com/api/v1/leaderboards/smite/scores/',
            'source_name': 'SMITE',
            'source_url': 'http://smitegame.com/',
        }


class AchievementImporter(base.AchievementImporter):
    pass


items = ItemImporter().run()
champions = ChampionImporter().run()
achievements = AchievementImporter(items, champions).run()
settings = SettingsImporter().run()
