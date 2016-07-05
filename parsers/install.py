import os
import sys
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
    config_src = '{}/config.xml'.format(src_dir)
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

    billing_key = input("Billing key for android purchases: ")

    call(["ionic", "plugin", "remove", "cc.fovea.cordova.purchase"])
    call([
        "ionic", "plugin", "add", "cc.fovea.cordova.purchase",
        "--variable", 'BILLING_KEY="{}"'.format(billing_key)
    ])

    # Build ios package
    call(["ionic", "build", "ios"])

    # Build android package
    call(["ionic", "build", "--release", "android"])

    def jarsigner(apk_name):
        call([
            "jarsigner", "-verbose",
            "-sigalg", "SHA1withRSA",
            "-digestalg", "SHA1",
            "-keystore", "puppybox-release.keystore",
            "platforms/android/build/outputs/apk/{}".format(apk_name),
            "puppybox-release"
        ])

    def zipalign(src_apk, dest_apk):
        try:
            os.remove(dest_apk)
        except:
            pass

        call([
            "zipalign",
            "-v", "4",
            "platforms/android/build/outputs/apk/{}".format(src_apk),
            "{}".format(dest_apk)
        ])

    src_apk = "android-armv7-release-unsigned.apk"
    jarsigner(src_apk)
    zipalign(src_apk, "{}_arm.apk".format(provider))

    src_apk = "android-x86-release-unsigned.apk"
    jarsigner(src_apk)
    zipalign(src_apk, "{}_x86.apk".format(provider))


if __name__ == '__main__':
    cli()
