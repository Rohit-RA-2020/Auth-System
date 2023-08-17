// create a basic express server
// import express
const express = require('express');
// import path
const path = require('path');
// import body-parser
const bodyParser = require('body-parser');
// import cors
const cors = require('cors');
const pool = require('./queries');


// import routes
//create an app
const app = express();
// set port
const port = 3000;

// create get route
app.get('/', (req, res) => {
    pool.query('SELECT * FROM persons', (error, results) => {
        if (error) {
            throw error;
        }
        res.send(results.rows);
    });
});

app.listen(port, () => {});