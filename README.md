# Moba Quiz

Moba Quiz is an application skeleton for building mobile app quizes for Moba games (but could be probably extended for other purposes in the future). Currently following games (providers) are supported:

  - League of Legends (iOS, Android)
  - Dota (iOS, Android)
  - Heroes of Newerth (iOS, Android)
  - SMITE (iOS, Android)
  - Vainglory (iOS, Android)


### Showcase

Few applications has been made using this skeleton. Here is the showcase:

 - [League of Legends - Android](https://play.google.com/store/apps/details?id=com.puppybox.quizlol)
 - [Heroes of Newerth - Android](https://play.google.com/store/apps/details?id=com.puppybox.quizhon)
 - [Dota 2 - Android](https://play.google.com/store/apps/details?id=com.puppybox.quizdota)
 - [SMITE - Android](https://play.google.com/store/apps/details?id=com.puppybox.quizsmite)
 - [Vainglory - Android](https://play.google.com/store/apps/details?id=com.puppybox.quizvg)
 - [League of Legends - iOS](https://itunes.apple.com/us/app/quiz-for-league-legends-ultimate/id1107274781?mt=8)
 - [Heroes of Newerth - iOS](https://itunes.apple.com/us/app/quiz-for-heroes-newerth-ultimate/id1109019404?mt=8)
 - [Dota 2 - iOS](https://itunes.apple.com/us/app/quiz-for-dota-2-ultimate/id1109010695)
 - [SMITE - iOS](https://itunes.apple.com/us/app/quiz-for-smite-ultimate/id1121065896?mt=8)
 - [Vainglory - iOS](https://itunes.apple.com/nz/app/quiz-for-vainglory-ultimate/id1175817991?mt=8)

### Version
2.3.5

### Tech

Moba Quiz is built using [Angular 2] & [Ionic 2].

### Installation

You need Ionic-CLI beta and cordova installed globally:

```sh
$ npm i -g ionic@beta cordova
```

```sh
$ git clone https://github.com/vintage/moba_quiz.git moba_quiz
$ cd moba_quiz
$ npm i
$ ionic lib update
$ ionic state restore
```

### Development

Want to contribute? Great!

First thing which you need to perform is to enable one of the provided plugins. To do so, let's enable the content from the League of Legends game:

```sh
$ python parsers/app/lol/parser.py
$ python parsers/install.py setup (in prompt enter `lol`)
```

Open your favorite Terminal and run following command.

```sh
$ ionic serve
```

You can now open your favourite browser and enter following URL:

```
http://localhost:8100/
```

### Todos

 - [x] Make the README readable & useful
 - [x] Redesign frontends (use custom UI, not the default one from Ionic)
 - [x] Improve performance for Android platform
 - [x] Write custom scripts for installing supported providers (eg. moba install league_of_legends)
 - [x] Integrate in-app purchases
 - [ ] Integrate facebook sharing for content (scores)
 - [x] Integrate with Google Analytics (Firebase?)
 - `find . -name '*.png' -exec pngquant --ext .png --force 256 {} \;`

License
----

MIT


**Free Software**

   [Angular 2]: <http://angular.io>
   [Ionic 2]: <http://ionicframework.com/docs/v2/>
