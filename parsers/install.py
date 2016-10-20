import os
import json
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
    data_dest = '{}/src/assets/data/'.format(app_dir)

    shutil.rmtree(data_dest, ignore_errors=True)
    shutil.copytree(data_src, data_dest)

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

    # Clear www directory
    shutil.rmtree("www", ignore_errors=True)
    os.makedirs("www")

    store_keys = {
        'smite': 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAicNxgzEHxuzWtZMOAByBSYEuSEwjhDMV9cJLEV3QuCV5zdWpwJHYW/Rqk0jgBpNNufVZuQoVteUa6Q+d++JsRgyOvqk4WApW+AfhKMO96Zq7cV6qqaqp0slMN7WPpFv69um8yz1MQLSRASj50b0GhhxCDIa819mt9fS1uVfTrxFFi51NWUJ0eMjbuBaX8tl+lreSfolmWjsRwPHyH6N3UPMhbstyElw827acxHCFtco/Bko3rOBAk4NK5VCmdwKuhjk3XVrOjCPqGMi1l9r0HiHYnCGtARcKIu7EpbZqzG5fyNHLopObGko3rU/JwJD0coJD3vQ0bJVAsTK+zrYmCwIDAQAB',
        'lol': 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtdmIAmtlzaHSodoO0OM3bELfMAqbMYsUDXGY9TkzQhQpWAwQcrsujfIvQkEj6fXjRgoeLz6F6KxLq6WtevK3xxtX3r69kVhk+cN4EjnKkJm6hBUHZVF4On1zSP4tPPPzVt1rijQW0jFRphAU9uWAKdrMPkXWu7elhp5rcxzYVyESO8y6fXprLfOyWLRqqJNu+TsIjAYuBF6BKNKcnvHh8pEJ+FD6ad/1CqDH+Buxabsq2/oKe6Q5BsYqO1cK0GgpzXjvTmiLGmDj3JSSviPF1O+yymJDm13KizkWO8KEzuVKtIzB0qXanvokgcZmkh4rC63+6hvxIqUtb4rycrNrTQIDAQAB',
        'hon': 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArGOg25j4XZK6OuVw/rJDfNfHBEn+JwQNWKSHw7VDFq/CLbKqwNUrT7FDnQ12RRlUEInqT3C+jcc7bINYjQnmFqnIKC13lbMVJo2/8dyy0E17ZRXteiBXkuDuFJczQejLzCKA1HSGTnQhlDWnUOYlzOGXnvTgQWKhrfj1j2vlR7KRDI6idsu/A/kVBBHx03mTQjvuKE4IfOxd9KWeD42QCJLNOjGfNGTUyqvIx1UtPEG25uvYf/aS5wFkw0eOVDeP6Ow+kTR4plMv3wHaaZZq2bU7r9YQOqiHsk9okjFQZhkJE3+tHbQkN6fYUtkNIdz3oxVBV9XV8Pzlcift+j40rwIDAQAB',
        'dota': 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAk1R7t1mlh24RV51YSTH2F7e3fOItXr4ttM4CMK/0afEUl+UM+8d7odxe/RfjjQfkxr7gbpeyPH/j2pPIcuokVoFYLVVLM7oTMWDvwMIep5ueaN5C4fErlSgBiZnmHJ+wsFz5m7zdiQDu06Y+rRZLBuJrLSNmWUaZ9oE2Mxh33E6v50iwT/c0IaBF5CSRqoXrlVdapd1HYhgRc6XZxhucfxls/OmmBc8BjkBNp3HL1uQcM84kWaQgwHNWMn7RWvllfmtGvr0n2LOb6r1RrzGvEPBrD5VAE5pKliEA/onrtJpYxyt+f19Rv4boTIrWUqNPFohz1JtTvDLaXqfm4vYaEwIDAQAB',
    }

    store_key = store_keys[provider]

    # Add manifest file for purchases
    with open("www/manifest.json", "w") as f:
        data = {"play_store_key": store_key}
        f.write(json.dumps(data))

    call(["ionic", "resources"])

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
    zipalign(src_apk, "builds/{}_arm.apk".format(provider))

    src_apk = "android-x86-release-unsigned.apk"
    jarsigner(src_apk)
    zipalign(src_apk, "builds/{}_x86.apk".format(provider))


if __name__ == '__main__':
    cli()
