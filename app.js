const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./src/routes/index');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(express.static('src/public'));

// Routes
app.use(routes);


app.listen(process.env.PORT || 8083, () => console.log(`Auth api is running on ${process.env.PORT}.`));