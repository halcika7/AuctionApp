# Atlantbh internship auction full stack web application

> This project was made using Angular, Node.js, Express(Node.js web application framework), PostgreSQL 

** After downloading or cloning add the following files **

---> Add config.json in backend/config folder something like:
```
    {
        "local": {
            "username": "dbusername",
            "password": "dbpassword",
            "database": "databasename",
            "host": "localhost",
            "port": 5433,
            "dialect": "postgres"
        },
        "development": {
            "username": "dbusername",
            "password": "dbpassword",
            "database": "databasename",
            "host": "localhost",
            "port": 5433,
            "dialect": "postgres"
        },
        "test": {
            "username": "dbusername",
            "password": "dbpassword",
            "database": "databasename",
            "host": "localhost",
            "port": 5433,
            "dialect": "postgres"
        },
        "production": {
            "username": "dbusername",
            "password": "dbpassword",
            "database": "databasename",
            "host": "localhost",
            "port": 5433,
            "dialect": "postgres"
        }
    }
```
---> Add .env in backend/ root folder :
```
    ACCESS_TOKEN_SECRET=
    REFRESH_TOKEN_SECRET=
    DB_USER=
    DB_PASSWORD=
    NODE_ENV=
```
** Run the following commands **

```bash
    cd path/to/project/folder

    cd backend/
    
    npm run backend-install
    npm run frontend-install
    npm run create-db
    npm run migrate

    npm run dev
```