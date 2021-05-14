require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./app/router');
const port = '3000';


app.use(cors({
    origin: 'http://localhost:8080'
}));
app.use(express.json());

app.use(router);

app.listen(port, () => console.log('listening on 3000'));