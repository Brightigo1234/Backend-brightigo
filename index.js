const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to mongo DB 🗃'))
  .catch((err) => {
    console.log(err);
  });

//Load all routes
const authRouter = require('./routes/auth.routes');

app.get('/', (req,res)=>{res.json("this is the backend of brightigo app")});
app.use('/api', authRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${process.env.PORT || 8080}!`);
});
