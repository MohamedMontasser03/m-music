# M Music - the last music player you'll ever need

A music app with that combines the best of all the music players in one app with a simple interface,
and a great user experience and a library from the best music players in the world.

## Steps to run locally

First you will need to create a `.env` file following the schema in `./src/env/schema.mjs`.

The Database will be created by default using sqlite if you want to change this,
you can change the url in the `./prisma/schema.prisma` file.

when you're done setting up the database run `npx prisma db push` to push the schema to the database.

Once you're done you can build the app using `yarn build` and run it locally with `yarn start`.
