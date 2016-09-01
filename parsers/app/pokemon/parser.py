import sys
sys.path.insert(0,'../..')

from lxml import html

import requests
from tqdm import tqdm

from app import base


class ChampionImporter(base.ChampionImporter):
    def download_image(self, url, filename):
        url = 'http://serebii.net{}'.format(url)

        return super().download_image(url, filename)

    def get_element_type(self, path):
        if '/pokedex-xy/' not in path:
            return None

        raw_type = path.split('/')[-1].split('.')[0]
        return raw_type[0].upper() + raw_type[1:].lower()

    def get_objects(self):
        template_url = 'http://serebii.net/pokemongo/pokemon/{}.shtml'

        objects = []
        for number in tqdm(range(1, 151), desc='Parsing pokemons'):
            pokedex = str(number).zfill(3)

            detail_url = template_url.format(pokedex)

            page = requests.get(detail_url)
            tree = html.fromstring(page.text)

            name_dom = tree.xpath('/html/body/table[2]/tr[2]/td[2]/font/div[2]/div/table[2]/tr[2]/td[2]')[0]
            image_dom = tree.xpath('/html/body/table[2]/tr[2]/td[2]/font/div[2]/div/table[2]/tr[2]/td[1]/table/tr/td/img')[0]
            types_dom = tree.xpath('/html/body/table[2]/tr[2]/td[2]/font/div[2]/div/table[2]/tr[2]/td[5]')[0]
            species_dom = tree.xpath('/html/body/table[2]/tr[2]/td[2]/font/div[2]/div/table[2]/tr[4]/td[1]')[0]

            fast_attack_dom = tree.xpath('//*[@id="moves"]/ul/li[1]/table[1]')[0]
            charge_attack_dom = tree.xpath('//*[@id="moves"]/ul/li[1]/table[2]')[0]

            types = set()
            for type_img in [t.attrib['href'] for t in types_dom.findall('a')]:
                raw_type = self.get_element_type(type_img)
                if raw_type:
                    types.add(raw_type)
            types = list(types)

            image_url = image_dom.attrib['src']
            image = self.download_image(image_url, 'pokemon_{}.png'.format(pokedex))

            # Fetch pokemon data
            name = name_dom.text
            title = species_dom.text

            champion = base.Champion(pokedex, name, image, title, tags=types)

            def parse_skills(doms):
                for _, attack in enumerate(doms):
                    if _ < 2:
                        continue

                    skill_pk = '{}_{}'.format(pokedex, _)
                    skill_name = attack.findall('td')[0].text_content().strip()

                    skill_type = self.get_element_type(
                        attack.findall('td')[1].find('a').attrib['href']
                    )
                    skill_value = attack.findall('td')[2].text_content().strip()

                    skill = base.Skill(skill_pk, skill_name, kind=skill_type, value=skill_value)

                    champion.add_skill(skill)

            parse_skills(fast_attack_dom.findall('tr'))
            parse_skills(charge_attack_dom.findall('tr'))

            objects.append(champion)

        return objects


class ItemImporter(base.ItemImporter):
    export_path = './data/items.json'
    image_path = './data/images/items/'

    def get_objects(self):
        return []


class SettingsImporter(base.ItemImporter):
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


class AchievementImporter(base.AchievementImporter):
    pass


items = ItemImporter().run()
champions = ChampionImporter().run()
achievements = AchievementImporter(items, champions).run()
settings = SettingsImporter().run()
