# Example Bank Transfer Service

This is an example of a service for handling money transfers which sends solicitations to settlements service.

## Basic stack used

- Node.js
- Express.js
- Knex (PostgreSQL)
- Jest
- Supertest
- Stubby


## Pre-requisites
 You need to have PostgreSQL installed and two databases, one called `dqr-challenge-test` and another called  `dqr-challenge-prod` .

## Test

To test app, first run `npm run stubby` to init mock server, and then run `npm test`. After execution finishes, you can see coverage in folder `__tests__`.

## Run

To run app, first exectute`npm run stubby` to init mock server and then run `npm start`. Use `POST /v1/transfers` to create a transfer solicitation. User `GET /v1/transfers` to see all transfers created. After creating at least 4 transfers, you can see 4 different returns from Settlements API mock using `GET /v1/transfers/{id}`.

### Docs

Swagger docs can be accessed in https://app.swaggerhub.com/apis/rchedid/dqr-challenge/1.0.0 or locally in http://localhost:3456/api-docs after run started.