import os
import shutil
from subprocess import call

import click


def validate_provider(ctx, param, value):
    directory = 'app/{}'.format(value)
    if not os.path.isdir(directory):
        raise click.BadParameter('Provider does not exist')

    return value


@click.group()
def cli():
    pass


@cli.command()
@click.option('--provider', prompt='Provider name', callback=validate_provider,
              help='Provider to install')
def setup(provider):
    src_dir = 'app/{}'.format(provider)
    app_dir = '..'

    # Copy config file
    config_src = '{}/config_{}.xml'.format(app_dir, provider)
    config_dest = '{}/config.xml'.format(app_dir)

    shutil.copy(config_src, config_dest)

    # Copy data files
    data_src = '{}/data/'.format(src_dir)
    data_dest = '{}/www/data/'.format(app_dir)

    shutil.rmtree(data_dest, ignore_errors=True)
    shutil.copytree(data_src, data_dest)

    # Copy background image
    background_src = '{}/static/background.jpg'.format(src_dir)
    background_dest = '{}/www/data/background.jpg'.format(app_dir)

    shutil.copy(background_src, background_dest)

    # Remove existing resources (splashscreen & icon)
    shutil.rmtree('{}/resources/android/'.format(app_dir), ignore_errors=True)
    shutil.rmtree('{}/resources/ios/'.format(app_dir), ignore_errors=True)

    # Copy app icon
    icon_src = '{}/static/icon.png'.format(src_dir)
    icon_dest = '{}/resources/icon.png'.format(app_dir)

    shutil.copy(icon_src, icon_dest)


@cli.command()
@click.option('--provider', prompt='Provider name', callback=validate_provider,
              help='Provider to install')
def build(provider):
    app_dir = '..'

    os.chdir(app_dir)

    call(["ionic", "resources"])

    # Build android package
    call(["ionic", "build", "--release", "android"])

    # Build ios package
    call(["ionic", "build", "ios"])


if __name__ == '__main__':
    cli()
