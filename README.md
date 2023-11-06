# The Pinging Pong

Welcome to the pinging pong project, delivered to you by the fabulous ponies !

This project include a chat with multiple chatroom, and a game interface to see, or play pong parties.
This is only availaible to 42 students accounts at the moment.

# How to build the project?

1. Include .env file following the instruction of `.env_sample` files present in the 03 folders (`/backend/.env`, `/frontend/.env`, `./.env`).

2. To buil Dev Environment: `yarn pre-dev`, then `yarn dev`.

3. To build Prod: `yarn build`, then go to the newly created folder `dist_folder` and do `yarn prod`.

Note: In Dev Environment we used NodeJs so we could have hot reloading. In Prod, we used Nginx as the requirement of the project.

4. Go to file `./docker-compose.md` to have better instruction in case of encounting errors.

5. Go to file `./package.json` for an overview on how scripts files are used (`.sh`).

## Coming soon

- Access link to the project
- CI CD
- Opened inscription

Stack (front) : Tailwind, react, typescript
Stack (back) : NestJS, typescript
