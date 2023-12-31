# Hopkins Club Connect (HOPCC)

HOPCC (Hopkins Club Connect) - An application management system for Hopkins clubs. Our app will allow clubs to clearly show their application timelines, required materials, and important information about their process. The app will also have the capability to fill out applications directly inside the app- which is customizable by the club. This will create a centralized place for students to see all of these application timelines in one place, and apply on a more unified platform. Applicants can also create an account and a profile so they don't have to fill out the same information for multiple clubs.


## Installing / Getting started

To get the app up & running on your local computer follow these instructions:

### Setting up the backend
1. Reference the .env.example in packages/server for what your env should look like (make sure your database ends with: hopcc-dev)
1. Make sure your database ends in hopcc-dev
1. Make sure your NODE_ENV is `development`
1. Make sure you have the Docker application installed (**NOT** the dependency) and running
1. Run `yarn dev` to start the express server
1. Run `yarn prisma:dev` to start up the db

### Setting up the frontend

1. Run `yarn dev`
1. Make sure your .env is populated according to .env.example in the packages/client folder


## Developing

Detailed and step-by-step documentation for setting up local development. 

### Setting up backend

1. Reference the .env.example for what your env should look like
1. Make sure your database ends in hopcc-dev
1. Make sure your NODE_ENV is dev
1. Make sure you have the Docker application(google docker download if you don't have it) installed (**NOT** the dependency) and running
1. Run `yarn dev` to start the express server
1. Run `yarn prisma:dev` to start up the db

#### package.json commands:

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

#### Things to do if you update the db schema:

1. Uncomment the lines in the prisma.schema that talk about generating an ERD
1. Run `yarn prisma:dev`
1. Comment out the lines that you uncommented.


## Testing

- To run backend tests, run `yarn prisma:test`
- Make sure that in your .env.test file, the database ends with hopcc-test and your NODE_ENV is test

 
