# DroneApp
Grocery Drone Delivery App

## Typescript + GraphQL + TypeORM Drone App


### To Run server 
1. Enter server directory `cd server`
2. Run the `grocery_drone_init.sql` file using MySQL workbench or command line mysql. 
   This will create the database and insert the initial data 
   Changes from CS 4400 phase 3 init.sql include hashing passwords in initial add 
   and added a AUTO_INCREMENT to the primary key for DRONE
3. Rename variables in .env.example for your machine, everything should be the same except password
4. Rename the .env.example file to .env `mv .env.example .env`
5. Install packages `yarn install`
6. Run server `yarn dev`

### To Run client
1. Enter client directory `cd client`
2. Install packages `yarn install`
3. Run client `yarn start`
