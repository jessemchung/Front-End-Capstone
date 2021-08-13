// var connectionString = "postgres://userName:password@serverName/ip:port/nameOfDatabase";

// var pgClient = new pg.Client(connectionString);
const query1 = "SELECT * FROM photos WHERE review_id=5 LIMIT 5;"



// pgClient.connect();
const express = require('express');
const pg = require('pg');
const keys = require('./config.js');
const { Pool } = require('pg');
var config = {
  user: 'postgres',
  database: 'stellar',
  password: keys.key,
  host: 'localhost',
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000
};
const pool = new Pool(config);
pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});
pool.query(query1, function (err, res) {
  if (err) {
    return console.error('error running query', err);
  }
  console.log(res.rows);
});



const app = express()
const port = 3000
// var connectionString = `postgres://userName:password@serverName/ip:port/nameOfDatabase`;



app.get('/', (req, res) => {

  pool.query(query1, function (err, res1) {
    if (err) {
      return console.error('error running query', err);
    }
    res.send(res1.rows);
  });
  // res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
