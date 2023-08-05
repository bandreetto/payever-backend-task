## Description

Payever backend technical assignment

## Installation

```bash
$ yarn install
```

Copy the sample env file and replace the dummy values:

```bash
$ cp .sample.env .env
```

## Configuration

Edit `.env` file as needed and restart the server to apply the new variables

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

Before running the e2e tests, make sure you have both mongo and rabbitMQ instances running and configured in `.test.env`, you can also use the provided `docker-compose.yml` to spin them up with the default ports as preconfigured in the `.test.env` by running:

```bash
docker-compose -p payever-backend-task up -d
```

Run tests using package.json scripts:

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
