# Cognito User Authentication API

This is a supplementary API that provides User Authentication Service with AWS Cognito for Login Platform.

# Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

# Pre-Requisties

1. Clone the repository in your machine
2. Visual Studio Code must be installed with the following plugins
    1. Prettier
    2. ESlint
3. Install the following
    1. Node V16.14.2
4. Environment variables must be setup in your machine


### Installing

1. To download and install the dependency: `npm install`
2. To run the application for local development: `npm run dev`


## Running the tests

1. Open your browser or Postman
2. Copy-paste the following URL: http://localhost:8091/api/userauthentication 
3. This should return the response code 200 and the encrypted text for "Login Successful"

The following are the available cognito-user-authentication endpoints:

| Method | Endpoint | Description | Parameters | Type |
| ------ | -------- | ----------- | ---------- | ---- |
| GET | /api/userauthentication | Retrieves the data of customer requested to login


## Built With

* [ExpressJS](https://expressjs.com/) - NodeJS web app framework
* [cognito User Pool](https://console.aws.amazon.com/cognito/home/) - AWS Cognito User Pool
* [NodeJS](https://nodejs.org/en/) - NodeJS
* [AWS SDK](https://aws.amazon.com/sdk-for-node-js/) - AWS SDK for NodeJS

## Author
* abhijith.goud
