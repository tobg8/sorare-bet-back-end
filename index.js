require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./app/router');


app.use(cors({
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'authorization']
}));

app.use((req, req, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header("Access-Control-Allow-headers", "Origin, x-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "POST");
    next();
})
app.use(express.json());

app.use(router);

app.listen(process.env.PORT || 3000, () => console.log('listening on 3000'));