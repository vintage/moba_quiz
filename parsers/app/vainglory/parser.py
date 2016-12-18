import sys
sys.path.insert(0,'../..')

import json

import requests
from tqdm import tqdm
from lxml import etree

from app import base

base_url = 'http://www.vaingloryfire.com'
items_url = 'http://www.vaingloryfire.com/vainglory/wiki/items'
champions_url = 'http://www.vaingloryfire.com/vainglory/wiki/heroes'


class ChampionImporter(base.ChampionImporter):
    def get_objects(self):
        heroes_response = requests.get(champions_url)
        tree_list = etree.HTML(heroes_response.content)

        detail_nodes = tree_list.xpath('//*[@id="cards"]/div[1]/div/a')

        objects = []
        for item in tqdm(detail_nodes, desc='Parsing champions'):
            detail_url = base_url + item.attrib['href'] + '/abilities/'
            response = requests.get(detail_url)
            tree = etree.HTML(response.content)

            o_name = tree.xpath('//*[@id="wiki"]/div[1]/div[1]/h2')[0].text
            o_id = self.slugify(o_name)

            if o_id in ['idris']:
                continue

            o_ranged = tree.xpath('//*[@id="chapter"]/div/table/tr/td[2]/table[1]/tr/td/text()')[2]

            if o_ranged not in ('Melee', 'Ranged'):
                raise Exception('Not this time')

            o_ranged = o_ranged == 'Ranged'
            o_nation = tree.xpath('//*[@id="chapter"]/div/table/tr/td[2]/table[1]/tr/td/text()')[6]
            o_nation = o_nation.split('/')[0]

            o_image_url = base_url + item.find('img').attrib['src']
            o_image = self.download_image(o_image_url, '{}_avatar.png'.format(o_id))

            skill_nodes = tree.xpath('//*[@id="chapter"]/table')

            champion = base.Champion(
                o_id, o_name, o_image, is_range=o_ranged, nation=o_nation
            )

            for skill_node in skill_nodes:
                cell = skill_node.find('td')
                if not cell:
                    continue

                attribs = cell.find('div').find('a').find('img').attrib
                s_name = attribs['title']
                s_id = self.slugify(s_name)
                s_image_url = base_url + attribs['src']
                s_image = self.download_image(
                    s_image_url, '{}_{}.png'.format(o_id, s_id)
                )

                skill = base.Skill(s_id, s_name, s_image)

                champion.add_skill(skill)

            objects.append(champion)

        return objects


class ItemImporter(base.ItemImporter):
    def get_objects(self):
        items_response = requests.get(items_url)
        tree_list = etree.HTML(items_response.content)

        detail_nodes = tree_list.xpath('//*[@id="cards"]/div[1]/div/a')

        objects = []
        for item in tqdm(detail_nodes, desc='Parsing items'):
            detail_url = base_url + item.attrib['href']
            response = requests.get(detail_url)
            tree = etree.HTML(response.content)

            o_name = tree.xpath('//*[@id="wiki"]/div[1]/div[1]/h2')[0].text
            o_id = self.slugify(o_name)
            o_price = tree.xpath('//*[@id="chapter"]/div/table[1]/tr/td[2]/span[2]/span/span[2]/span[2]/span')[0].text

            if o_price == 'O':
                continue

            o_image_url = base_url + item.find('img').attrib['src']
            o_image = self.download_image(o_image_url, '{}.png'.format(o_id))

            recipe_1 = tree.xpath('//*[@id="chapter"]/div/table[2]/tr[3]/td/table/tr/td[1]/table[1]/tr/td[2]/span[1]/a')
            recipe_2 = tree.xpath('//*[@id="chapter"]/div/table[2]/tr[3]/td/table/tr/td[3]/table[1]/tr/td[2]/span[1]/a')

            recipe = []
            if recipe_1:
                recipe.append(self.slugify(recipe_1[0].text))

            if recipe_2:
                recipe.append(self.slugify(recipe_2[0].text))

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
