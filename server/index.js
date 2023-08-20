const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000;
const pool = require('./queries');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// create get route
app.get('/', (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error;
        }
        res.send(results.rows);
    });
});


app.post('/createUser', (req, res) => {
    const {email, password, name} = req.body;

    if((pool.query(`select COUNT(*) from users where email = ${email}`)) == 0) {
        console.log("email does not exist")
        res.status(201).send(`User added`);
    } else {
        console.log("email exists")
        res.status(409).send(`User already exists`);
    }
});

// app.post('/createUser', (req, res) => {
//     const {email, password, name} = req.body;
//     pool.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3)', [email, password, name], (error, results) => {
//         if (error) {
//             res.status(409).send(error);
//         }
//         res.send(`User added`);
//     });
// });

app.listen(port, () => console.log(`Server listening on port ${port}!`));