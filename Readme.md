# kamrusepa
Develop a single page blood donation management system to facilitate the patients from all around the world, find blood donors near them. 

## Setup
 - Install node js (v6.3.0 or greater)
 - Update NPM 
   ```bash
   npm update -g npm
   ```
 - Install global packages 
   ```bash
   npm install -g bower typings mocha tsc typescript ts-node gulp lite-server
   ```
API
 - Inside code folder go to api folder (cd api)
   ```bash
   cd api
   ```
 - Install packages
   ```bash
   npm install
   ```
 - Run api tests
   ```bash
   mocha
   ```
 - API need following environments to work:
    - MONGODB_URI: which is you mongodb url, if none was provided app will use localhost 27017
    -  APP_SECRET: Secret key for jswon web token
    -  ORIGINS_WHITELIST: List of allowed origins separeted by , Ex: http://localhost:3000, http://localhost:8080
 - To start the app just run:
   ```bash
   gulp serve
   ``` 
 - App will be started on port 3000, [http://localhost:3000/](http://localhost:3000/). If you want to change app port just set PORT env variable.

## WEB
 - Inside code folder go to web folder
   ```bash
   cd web
   ```
 - Install packages
   ```bash
   npm install
   ```
 - Start application: 
   ```bash
   npm start
   ``` 
 - A browser window will open pointing to [http://localhost:3001/](http://localhost:3001/)

## Running using docker

If you have docker and docker-compose installer you can run web and api using docker-compose.

### API 

- Inside code folder go to api folder
   ```bash
   cd api
   ```
- Run the app:
   ```bash
   docker-compose up mongolab web
   ```

### WEB 

- Inside code folder go to web folder
   ```bash
   cd web
   ```
- Run the app:
   ```bash
   docker-compose up web
   ```


> If you are using docker on mac or windows and it is not the beta version. You probably will have to to change web/config/environment.ts.

> Following variables:  
>   baseUrl: 'http://localhost:3000/api' and  
>   wsUrl: 'ws://localhost:3000'

> Should use your VM ip instead of locahost. 

# Live version
[http://kamrusepa.herokuapp.com/](http://kamrusepa.herokuapp.com/)