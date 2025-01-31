All the endpoints and their use examples can be found in api folder which contains http files for each endpoint.

To set up the project you need to have Docker set up and running. 

Go to project root directory and run this command:

```bash
docker compose up
```

It would pull required images and start up the app at port 3001.

The volumes for app and database - in this case MongoDB, are persistend and data is not lost between restart of application. If you want to clean volumes you can do it easily in Docker dashboard or in terminal.

### Endpoints

This app has `/api` endpoints for app call and `/md` endpoints for static files, images. 

In the api side there is authentication/authorisation and user endpoints. 

1. You can register `http://localhost:3001/api/v1/auth/register`
2. You can login at `http://localhost:3001/api/v1/auth/login`
3. You can reset your password at `POST http://localhost:3001/api/v1/auth/resetPassword`
4. You can see your info at `GET http://localhost:3001/api/v1/users/me`
5. You can update your info at `PATCH http://localhost:3001/api/v1/users/me` by providing required body. 
6. You can also add an address for yourself.

All the examples for these features are in `./api/` folder. 

7. You can upload images at `POST http://localhost:3001/api/v1/media` by providing a formdata. example at `./api/media.http`. It is going to return the URL for uploaded image and you need to use this url to access the image. Access to static files are open to read. 
8. You can delete an image by providing its name to the uri. Example: `DELETE http://localhost:3001/api/v1/media/{image0.png}`. It either would return status `200` which is for success or `400` with message. 
