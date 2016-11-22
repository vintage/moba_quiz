import sys
sys.path.insert(0,'../..')

import json

from tqdm import tqdm
from pyquery import PyQuery as pq

from app import base

items_url = 'http://vainglorydb.com/items'
champions_url = 'http://vainglorydb.com/heroes'


class ChampionImporter(base.ChampionImporter):
    def get_objects(self):
        dom = pq(url=champions_url)
        container = dom('.items')

        objects = []
        for item in tqdm(container.items('li'), desc='Parsing champions'):
            detail_url = item.find('a').attr('href')
            detail_dom = pq(url=detail_url)

            o_name = detail_dom.find('.section-head a').text()
            o_id = o_name.lower()
            o_ranged = detail_dom('.basic-panel .basic-table tr').eq(0).find('td').eq(1).text()
            o_nation = detail_dom('.basic-panel .basic-table tr').eq(2).find('td').eq(1).text()

            o_image_url = 'http://www.vaingloryfire.com/images/wikibase/icon/heroes/{}.png'.format(o_id)
            o_image = self.download_image(o_image_url, '{}_avatar.png'.format(o_id))

            skill_nodes = list(detail_dom.find('#hero-abilities').items('li'))

            champion = base.Champion(
                o_id, o_name, o_image, is_range=o_ranged, nation=o_nation
            )

            for skill_node in skill_nodes:
                skill = json.loads(skill_node.attr('data-ability'))

                s_id = str(skill['id'])
                s_name = skill['name']
                s_image_url = skill['icon']
                s_image = self.download_image(
                    s_image_url, '{}_{}.png'.format(o_id, s_id)
                )

                skill = base.Skill(s_id, s_name, s_image)

                champion.add_skill(skill)

            objects.append(champion)

        return objects


class ItemImporter(base.ItemImporter):
    def get_objects(self):
        dom = pq(url=items_url)
        container = dom('.items')

        objects = []
        for item in tqdm(container.items('li'), desc='Parsing items'):
            detail_url = item.find('a').attr('href')
            detail_dom = pq(url=detail_url)

            data = json.loads(item.attr('data-item'))

            o_id = str(data['id'])
            o_name = data['name']
            o_price = data['cost']

            o_image_url = data['icon']
            o_image = self.download_image(
                o_image_url, '{}.png'.format(o_id)
            )

            build_trees = list(detail_dom.items('.build-tree'))

            recipe, max_price = [], 0
            for build_tree in build_trees:
                recipe_items = [
                    json.loads(i.attr('data-item')) for i in list(build_tree.items('a'))
                ]

                r_ids = [str(r['id']) for r in recipe_items]
                r_price = sum([r['cost'] for r in recipe_items])

                # Skip it as its same item
                if o_id in r_ids:
                    continue

                if o_price >= r_price and r_price > max_price:
                    max_price = r_price
                    recipe = r_ids

            item = base.Item(o_id, o_name, o_image, [], recipe, o_price)

            objects.append(item)

        return objects


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
                'store_premium': 'com.puppybox.quizvg.premium_version',
            },
            'android': {
                'ad_small': 'ca-app-pub-4764697513834958/4637657667',
                'ad_big': 'ca-app-pub-4764697513834958/5695588466',
                'ad_video_id': '1197472',
                'ad_video_key': 'a04ae4e3efe676b70a3f19695b0f95b448e7bb8c',
                'tracking': 'UA-77793311-3',
                'store': 'market://details?id=com.puppybox.quizvg',
                'store_premium': 'com.puppybox.quizvg.premium_version',
            },
            'windows': {
                'ad_small': 'ca-app-pub-4764697513834958/7883646863',
                'ad_big': 'ca-app-pub-4764697513834958/7744046068',
                'ad_video_id': '',
                'ad_video_key': '',
                'tracking': '',
                'store': '',
            },
            'legal_disclaimer': 'This application is not created, sponsored or endorsed by Super Evil Megacorp and doesn’t reflect the views or opinions of Super Evil Megacorp or anyone officially involved in producing or managing Vainglory. Vainglory is a registered trademark of Super Evil Megacorp. All in-game descriptions, characters, locations, imagery and videos of game content are copyright and are trademarked to their respective owners. Usage for this game falls within fair use guidelines.',
            'highscore_url': 'http://mobascore-puppybox.rhcloud.com/api/v1/leaderboards/vg/scores/',
            'source_name': 'Vainglory',
            'source_url': 'http://www.vainglorygame.com/',
        }


class AchievementImporter(base.AchievementImporter):
    pass


items = ItemImporter().run()
champions = ChampionImporter().run()
achievements = AchievementImporter(items, champions).run()
settings = SettingsImporter().run()
