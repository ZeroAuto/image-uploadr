require('dotenv').config()
const express = require('express')
const cloudinary = require('cloudinary')
const formData = require('express-form-data')
const cors = require('cors')

const app = express()

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});
  
app.use(cors({ 
  origin: 'http://localhost:3000'
}));

app.use(formData.parse());

app.get('/images', (req, res) => {
  cloudinary.api.resources((result) => {
    res.json(result);
  })
});

app.post('/upload', (req, res) => {
  const image = req.files.image;
  console.log(image);
  cloudinary.v2.uploader.upload(
    image.path, 
    {
      public_id: image.originalFilename,
    },
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
      }
    }
  ).then(results => res.json(results));
});

app.listen(8080, () => console.log('server is running on port 8080'));
