const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const app = express();
app.use(cors);
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
const userRouter = require('./routes/user.routes');

app.use('/', express.static('dist'));
app.use('/api', authRouter);
app.use('/api', userRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${process.env.PORT || 8080}!`);
});
