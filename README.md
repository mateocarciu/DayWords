# DayWords

DayWords est une application mobile développée en React Native. L'idée est que l'utilisateur reçoive une notification à un moment aléatoire de la journée. À ce moment-là, il peut écrire une phrase, un texte ou un mot pour résumer sa journée. Il peut également démarrer un fil de discussion, ajouter des amis, voir les publications de ses amis et commenter celles-ci.

## Prérequis Backend

Pour installer les dépendances et démarrer le serveur backend, exécutez les commandes suivantes :

```sh
composer install
php artisan serve
```

Installer & démarrer redis (mac) :

```sh
brew install redis
redis-server
```

## Socket server

Démarrer la queue :

```sh
php artisan queue:work
```

Démarrer le laravel echo server :

```sh
laravel-echo-server start --debug
```

## Prérequis Frontend

Pour installer les dépendances et démarrer le serveur frontend, exécutez les commandes suivantes :

```sh
yarn install -g expo-cli
yarn install
```

## Démarrer le Frontend

Pour démarrer l'application frontend, exécutez la commande suivante :

```
yarn expo start
```

## Fonctionnalités

1. Recevoir une notification à un moment aléatoire de la journée pour écrire une entrée.
2. Démarrer un fil de discussion.
3. Ajouter des amis et voir leurs publications.
4. Commenter les publications des amis.
5. Notifications en temps réel pour les nouvelles publications des amis.

## Technologies Utilisées

- **Frontend**: React Native, Expo
- **Backend**: Laravel, PHP
- **Sockets**: Socket.IO
