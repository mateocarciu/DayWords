# DayWords

DayWords est une application mobile développée en React Native. L'idée est que l'utilisateur puisse écrire une phrase, un texte ou un mot pour résumer sa journée. Il peut également démarrer un fil de discussion, ajouter des amis, voir les publications de ses amis et commenter celles-ci.

<div style="display: flex; justify-content: space-around; align-items: center; gap: 10px;">
    <img src="https://mateocarciu.github.io/images/DayWordsHomePage.webp" alt="Screenshot 1" style="width: 30%; height: auto;">
        <img src="https://mateocarciu.github.io/images/DayWordsDetail.webp" alt="Screenshot 2" style="width: 30%; height: auto;">
    <img src="https://mateocarciu.github.io/images/DayWordsFriends.webp" alt="Screenshot 3" style="width: 30%; height: auto;">
</div>

## Prérequis Backend

Pour installer les dépendances et démarrer le serveur backend, exécutez les commandes suivantes :

```sh
composer install
php artisan serve
```

Démarrer le serveur SSE :

```sh
docker compose -f 'sse/docker-compose.yml' up -d --build
```

## Prérequis Frontend

Pour installer les dépendances et démarrer le serveur frontend, exécutez les commandes suivantes :

```sh
npm install -g expo-cli
npm install
```

## Démarrer le Frontend

Pour démarrer l'application frontend, exécutez la commande suivante :

```sh
npx expo start
```

## Fonctionnalités

1. Écrire une entrée par jour (style journal quotidien).
2. Démarrer un fil de discussion.
3. Ajouter des amis et voir leurs publications.
4. Commenter les publications des amis.
5. Notifications en temps réel pour les nouvelles publications des amis.

## Technologies Utilisées

- **Frontend**: React Native, Expo
- **Backend**: Laravel, PHP
- **SSE**: Redis, Node.js, Docker
