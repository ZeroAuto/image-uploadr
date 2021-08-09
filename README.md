## Getting Started
First clone the repo.
`yarn` must be installed in order to run the project. There is a frontend application in react and an express proxy server. Rather than creating some kind of file upload

```
git clone https://github.com/ZeroAuto/image-uploadr.git
cd image-uploader/client
yarn install && yarn start
// open new terminal
cd image-uploader/server
yarn install && yarn start
```

#### To run this project you need a Cloudinary credentials. 
A .env file must be present in the `server` folder with the credentials below. I sent my credentials in an email to Sana. The app won't work without them.[/'']

```shell
// server/.env
CLOUD_NAME=your_cloud_name
API_KEY=your_cloud_key
API_SECRET=your_cloud_secret
```

#### Future work
Given more time I would definitely make this project look nicer. Using a frontend framework like bootstrap would make it easier. The images list, buttons and inputs could also be put into their own components to keep the App.js file from getting too big. If the images list got too big it would be a good idea to add pagination and set up the search text could trigger another get from the API, but would probably have to be debounced.
Right now I'm using the filename to search images, but the API allows tags to be set that could also be searched for.