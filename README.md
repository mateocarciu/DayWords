# DayWords

DayWords is a mobile application developed in React Native. The idea is that the user can write a sentence, a text, or a word to summarize their day. They can also start a discussion thread, add friends, view their friends' posts, and comment on them.

<div style="display: flex; justify-content: space-around; align-items: center; gap: 10px;">
    <img src="https://mateocarciu.github.io/images/DayWordsHomePage.webp" alt="Screenshot 1" style="width: 30%; height: auto;">
    <img src="https://mateocarciu.github.io/images/DayWordsDetail.webp" alt="Screenshot 2" style="width: 30%; height: auto;">
    <img src="https://mateocarciu.github.io/images/DayWordsFriends.webp" alt="Screenshot 3" style="width: 30%; height: auto;">
</div>

## Backend Prerequisites

To install the dependencies and start the backend server, run the following commands:

```sh
composer install
php artisan serve
```

Start the SSE server:

```sh
docker compose -f 'sse/docker-compose.yml' up -d --build
```

## Frontend Prerequisites

To install the dependencies and start the frontend server, run the following commands:

```sh
npm install -g expo-cli
npm install
```

## Start the Frontend

To start the frontend application, run the following command:

```sh
npx expo start
```

## Features

1. Write one entry per day (daily journal style).
2. Start a discussion thread.
3. Add friends and view their posts.
4. Comment on friends' posts.
5. Real-time notifications for new posts from friends.

## Technologies Used

- **Frontend**: React Native, Expo
- **Backend**: Laravel, PHP
- **SSE**: Redis, Node.js, Docker
