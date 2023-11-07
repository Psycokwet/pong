# The Pinging Pong

Welcome to the pinging pong project, delivered to you by the fabulous ponies !

This project include a chat with multiple chatroom, and a game interface to see, or play pong parties.
This is only available to 42 student accounts at the moment.

# How to build the project?

1. Include .env file following the instruction of `.env_sample` files present in the 03 folders (`/backend/.env`, `/frontend/.env`, `./.env`).

2. To build Dev Environment: `yarn pre_dev`, then `yarn dev`.

3. To build Prod: `yarn build`, then go to the newly created folder `dist_folder` and do `yarn prod`.

Note: In Dev Environment we used NodeJs so we could have hot reloading. In Prod, we used Nginx to mimic real kind of production web app. We haven't known the reason why static websites are preferable in real life, any suggestion is appreciated.

4. Go to file `./docker-compose.md` to have better instruction in case of errors.

5. Go to file `./package.json` for an overview on how scripts files are used (`.sh`).

## Coming soon

- Access link to the project
- CI CD
- Opened inscription

Stack (front) : Tailwind, react, typescript
Stack (back) : NestJS, typescript
