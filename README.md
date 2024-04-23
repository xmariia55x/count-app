# count-app

## Project description

A node project that exposes a REST API with 3 endpoints:

`/health` GET endpoint to check if the API is up and running.

`/count` GET endpoint to retrieve the count key from a Redis DB.

`/track` POST endpoint to store data received from the request body to a local file and update a count key in a DB.


### Assumptions

Count parameter is an integer, not a float data type.

The count key is incremented by the count number specified in the parameter. This means that if the current value of the count key in Redis is 4 and the parameter's value is 5, the value that will be saved in the DB is 9. 

We are supposing that the local file mentioned in the test is a JSON file.

When it comes to storing the JSON data into the local file, we have to take into account that if a key already exists, it will replace its value. Let's say our local JSON file already contains a 'count' key, its value will be replaced by the one received as a parameter.

### Future work

There is room for improvement in terms of typing data.

Reduce complexity of the createServer function.

### How to run the application

Once you have cloned this repository into your machine, there are 2 options to run the application:

- With NPM and Docker
- With NPM, node and a redis database up and running

### Steps to deploy using Docker

Assuming you have NPM, Docker and docker compose installed in your device, rename the `.env.template` file to `.env`.

Then you just have to run `npm run deploy:docker`.

This will create a docker project where a redis DB and the API will be running. The API exposes the port 3000 in order to be reachable from outside the container. 

### Steps to deploy using NPM, node and a redis database

I assume that you already have a redis DB up and running and listening in a certain port, let's say the default one (6379). 

Rename the `.env.template` file to `.env` and change the Redis host to `127.0.0.1`.

Run an install to get all the dependencies: `npm install`.

Run the following script to locally start the API: `npm run start:local`.
