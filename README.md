# Moba Quiz

Moba Quiz is an application skeleton for building mobile app quizes for Moba games (but could be probably extended for other purposes in the future). Currently following games (providers) are supported:

  - League of Legends (iOS, Android)
  - Dota (iOS)
  - Heroes of Newerth (iOS, Android)

### Version
1.3.1

### Tech

Moba Quiz is built using [Angular 2] & [Ionic 2].

### Installation

Moba Quiz requires [Node.js](https://nodejs.org/) v3.7+ to run.

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

First thing which you need to perform is to enable one of the provided plugins. To do so, let's enable League of Legends quiz. Copy the data_example directory from parsers/ to www/ directory:

```sh
$ cp -r parsers/data_example/ www/data/
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

 - Write tests
 - Redesign frontends (use custom UI, not the default one from Ionic)
 - Improve performance for Android platform
 - Write custom scripts for installing supported providers (eg. moba install league_of_legends)

License
----

MIT


**Free Software**

   [Node.js]: <http://nodejs.org>
   [Angular 2]: <http://angular.io>
   [Ionic 2]: <http://ionicframework.com/docs/v2/>
