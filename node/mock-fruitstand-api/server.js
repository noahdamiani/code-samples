/**
 * Dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fruits = require('./fruits.json');


/**
 * Simple express API.
 */
const server = express();
const port = process.env.PORT || 4300;

server.use(cors());
server.options('*', cors());
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

const router = express.Router();

/**
 * Sends all fruit in stock.
 */
router.get('/inventory', (req, res) => {
    res.json(fruits);
});

/** 
 * Sends a single piece of fruit based on requested ID.
 */
router.get('/inventory/:id', (req, res) => {
    const payload = fruits.find(f => f.id === req.params.id) || null;
    res.json(payload);
});

server.use('/api', router);
server.listen(port);
console.log(`Fruitstand API Starting on Port ${port}`);