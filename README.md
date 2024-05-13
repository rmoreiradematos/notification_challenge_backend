# Projeto de Desafio de Notificações

This is a sample project to demonstrate how to set up a notification service using Node.js, Express, TypeScript, and Prisma ORM.

## Instalation

To install the project dependencies, run the following command:
- `npm install`: To install all dependencies.
- `docker compose up --build`: to run the docker container.


## Database Configuration

This project uses Prisma ORM to interact with the database. Make sure you have properly configured the .env file with the database information. After configuring the .env, you can run the database migrations with the following command:


- `npm run generate`: Generates Prisma Client code based on your data model.
- `npm run migrate`: Executes database migrations.
- `npm run seed`: Adds initial data to the database.

## Running the Project

After installing the dependencies and configuring the database, you can start the server with the following command:

```bash
npm run dev
```


