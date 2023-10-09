# README for the Backend

## Setting up for the first time:

1. Reference the .env.example for what your env should look like
1. Make sure you have the Docker application(google docker download if you don't have it) installed (**NOT** the dependency) and running
1. Run `yarn dev` to start the express server
1. Run `yarn prisma:dev` to start up the db

## package.json commands:

> Update this file when commands change
- `start` : runs the directory you are using node
- `dev`: will start the development backend server
- `test`: will run all the tests and generate a coverage report that will go into the **coverage** directory
- `build` : compiles and builds the server
- `postinstall`: is running automatically after you install and dependencies
- `format`: formats all the files in the server package using prettier
- `docker:up` : will construct a docker container that will contain our psql database. Have the docker application open **NOTE:** if you have other docker containers on port 5432 please open the docker app and press the stop button on them
- `docker:down` : Will stop the docker container
- `prisma:format`: formats the prisma schema may add relations so use carefully(should be fine in most cases)
- `prisma:generate` : regenerates the Prisma Client
- `prisma:push` : Will push the current prisma.schema into the db and regenerate the Prisma Client
- `prisma:seed` : seeds the db
- `prisma:dev` : Will run `docker:up`, `prisma:push`, and `prisma:generate`. **This is the command you should use when you make changes to the db or need to start up the db.** If it asks wiping the db you should likely type `y` unless you know that is incorrect.
- `prisma:dev:studio` : Will open a db visualizer. **NOTE:** you should run `yarn prisma:dev` before this otherwise it may fail or you may have a non-seeded/out of date db.
- `prisma:dev:reset` : Will wipe the db data
- `prisma:test` : Will seed the data with testing data using your `.env.test` file and the test seed data. **NOTE: This command should not really be used as it is called by `test`**
- `prisma:test:studio` : Similiar to `prisma:dev:studio` but for tests

## Things to do if you update the db schema:

1. Uncomment the lines in the prisma.schema that talk about generating an ERD
1. Run `yarn prisma:dev`
1. Comment out the lines that you uncommented
