# Atlantbh internship auction full stack web application

> This project was made using Angular, Node.js, Express(Node.js web application framework), PostgreSQL

** After downloading or cloning add the following file **

---> Add .env in root folder :

```
    ACCESS_TOKEN_SECRET=
    REFRESH_TOKEN_SECRET=
    DB_USER=
    DB_PASSWORD=
    DB_PORT=
    DB_HOST=
    DB_NAME=
    URL=http://localhost:3000 /* example */
    SEND_GRID=/* API_KEY */
    CLOUDINARY_CLOUD=
    CLOUDINARY_KEY=
    CLOUDINARY_SECRET=
    TWILIO_SID=
    TWILIO_AUTH_TOKEN=
    STRIPE_KEY=
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    FACEBOOK_CLIENT_ID=
    FACEBOOK_CLIENT_SECRET=
    NEVERBOUNCE_API_KEY=
    NODE_ENV=
```

** Run the following commands **

```bash
    cd path/to/project/folder

    npm run backend-install
    npm run frontend-install
    npm run create-db
    npm run migrate

    npm run dev
```
If you want to seed database 

```bash
    npm run generate-users
    npm run seed
```
