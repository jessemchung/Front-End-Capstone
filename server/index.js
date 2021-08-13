const express = require('express');
const axios = require('axios');
const path = require('path');
const config = require('../config');
const Calls = require('../api');

const app = express();
const port = 3000;


const pg = require('pg');
const keys = require('./config.js');
const { Pool } = require('pg');
var config1 = {
  user: 'postgres',
  database: 'stellar',
  password: keys.key,
  host: 'localhost',
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000
};
const pool = new Pool(config1);
pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});

// pool.query(query1, function (err, res) {
//   if (err) {
//     return console.error('error running query', err);
//   }
//   console.log(res.rows);
// });



app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
axios.defaults.headers.common.Authorization = config.TOKEN;
axios.defaults.baseURL = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo';

app.get('/products', (req, res) => {
  axios.get('/products')
    .then((results) => {
      res.status(200).send(results.data);
    })
    .catch((err) => {
      res.send(err);
    });
});






app.get('/products/:product_id', (req, res) => {
  axios.get(`/products/${req.params.product_id}`, { params: req.params })
    .then((results) => {
      res.status(200).send(results.data);
    })
    .catch((err) => {
      res.send(err);
    });
});

//my junk

app.get('/reviews', (req, res) => {
  let sortBy;
  let dataReviews;
  if (req.query.sort === 'newest') {
    sortBy = 'ORDER BY date DESC';
  }

  if (req.query.sort === 'helpful') {
    sortBy = 'ORDER BY helpfulness DESC';
  }

  if (req.query.sort === 'relevant') {
    sortBy = 'ORDER BY helpfulness DESC ORDER BY date DESC';
  }

  console.log(req.query, 'req.query');
  const query1 = `SELECT * FROM reviews
  WHERE product_id=${req.query.product_id}
  ${sortBy}
  LIMIT ${req.query.count};`;
  // console.log(query1, 'query1');
  pool.query(query1).then((hel) => {
    let shell = hel;

    // const forLoop = async _ => {
    //   console.log('Start')

    //   for (let i = 0; i < shell.rows.length; i++) {
    //     console.log('hello');
    //     let reviewId = shell.rows[i].id;
    //     const queryPhotos = `SELECT url FROM photos WHERE review_id=${reviewId}`
    //     let something = new Promise(resolve(pool.query(queryPhotos)));
    //     console.log(something, 'something');

    //   }

    //   new Promise( (resolutionFunc,rejectionFunc) => {
    //     resolutionFunc(777);
    // });


    //   console.log('End')
    // }

    // forLoop();
    // console.log({results:hel.rows}, 'hel');
    res.status(200).send({results:hel.rows});

  }).catch((err) => console.log('Error in productsDB', err))

});


app.get('/reviews/characteristics', (req, res) => {

  console.log(req.query, 'characteristics');
  const query1 = `SELECT * FROM characteristics
  WHERE product_id=${req.query.product_id};`;
  console.log(query1, 'query1');
  pool.query(query1).then((hel) => {
    let shell = hel;

    console.log({results:hel.rows}, 'hel');
    res.status(200).send({results:hel.rows});

  }).catch((err) => console.log('Error in productsDB', err))

});

app.get('/reviews/meta', (req, res) => {
  // console.log('hello2');
  axios.get('/reviews/meta', { params: req.query })
    .then((results) => {
      // console.log('hello2');

      res.send(results.data);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get('/reviews/characteristicsreviews', (req, res) => {


  function doSomethingAsync(value) {
    console.log(JSON.parse(req.query.characteristicsreviewsID), 'characteristicsshel')
    console.log(value, 'aaaaaa');

    return new Promise((resolve) => {

      const query1 = `SELECT * FROM Characteristicsreviews
      WHERE characteristic_id=${value.id};`;
      console.log(query1, 'query1');


      pool.query(query1).then((hel) => {
        let shell = hel;
        resolve(hel.rows);

      })



    });
  }

  function test() {
    const listCharacter = JSON.parse(req.query.characteristicsreviewsID);

      const promises = [];

      for (let i = 0; i < listCharacter.length; ++i) {
          promises.push(doSomethingAsync(listCharacter[i]));
      }

      Promise.all(promises)
          .then((results) => {
              console.log("All done", results);
              res.status(200).send(results);

          })
          .catch((e) => {
              // Handle errors here
          });
  }

  test();






  // pool.query(query1).then((hel) => {
  //   let shell = hel;

  //   console.log({results:hel.rows}, 'characterreviewhel');
  //   res.status(200).send({results:hel.rows});

  // }).catch((err) => console.log('Error in productsDB', err))

  // console.log(req.query, 'characteristics');
  // const query1 = `SELECT * FROM characteristics
  // WHERE product_id=${req.query.product_id};`;
  // console.log(query1, 'query1');
  // pool.query(query1).then((hel) => {
  //   let shell = hel;

  //   console.log({results:hel.rows}, 'hel');
  //   res.status(200).send({results:hel.rows});

  // }).catch((err) => console.log('Error in productsDB', err))

});


app.get('/reviews/characteristics', (req, res) => {
  // console.log('hello2');
  axios.get('/reviews/meta', { params: req.query })
    .then((results) => {
      // console.log('hello2');

      res.send(results.data);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post('/reviews', (req, res) => {
  axios.post('/reviews', req.body)
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  axios.put(`/reviews/${req.params.review_id}/helpful`)
    .then((results) => {
      res.send(results.data);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.put('/reviews/:review_id/report', (req, res) => {
  axios.put(`/reviews/${req.params.review_id}/report`)
    .then((results) => {
      res.send(results.data);
    })
    .catch((err) => {
      res.send(err);
    });
});


//my junk


app.get('/display', (req, res) => {
  Calls.getDisplay(req.query.productId)
    .then((results) => {
      res.status(200).send(results.data);
    })
    .catch((err) => {
      // console.log('Error: ', err);
      res.status(500).send(err);
    });
});

app.post('/reviews', (req, res) => {
  /*
    {
      "product_id": 25167,
      "rating": 5,
      "summary": "summary review text",
      "body": "summary body text",
      "recommend": false,
      "name": "briang",
      "email": "briang@gmail.com",
      "photos": [],
      "characteristics": { "84509": 1.5, "84510": 3, "84511": 2, "84512": 2 }
    }
  */
});

// Q&A Routes
app.get('/qa/questions', (req, res) => {
  axios.get('/qa/questions', { params: req.query })
    .then((response) => {
      res.status(200).send(response.data.results);
    })
    .catch((err) => res.status(404).send(err));
});

app.get('/qa/questions/:question_id/answers', (req, res) => {
  const questionId = req.query.question_id;
  axios.get(`/qa/questions/${questionId}/answers`, { params: req.query })
    .then((response) => res.status(200).send(response.data.results))
    .catch((err) => res.status(404).send(err));
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  axios.put(`/qa/questions/${req.body.question_id}/helpful`)
    .then((response) => res.status(204).send(response.data))
    .catch((err) => res.status(400).send(err));
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  axios.put(`/qa/answers/${req.body.answer_id}/helpful`)
    .then((response) => res.status(204).send(response.data))
    .catch((err) => res.status(400).send(err));
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  axios.put(`/qa/answers/${req.body.answer_id}/report`)
    .then((response) => res.status(204).send(response.data))
    .catch((err) => res.status(400).send(err));
});

app.post('/qa/questions', (req, res) => {
  axios.post('/qa/questions', req.body)
    .then((response) => res.status(201).send(response.data))
    .catch((err) => res.status(400).send(err));
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  axios.post(`/qa/questions/${req.body.questionId}/answers`, req.body)
    .then((response) => res.status(201).send(response.data))
    .catch((err) => res.status(400).send(err));
});
// End of Q&A Routes

app.get('/products/:product_id/related', (req, res) => {
  // console.log('this has been ran');
  const promise = Calls.getRelatedProductIds(req.params.product_id);

  async function resolves(promises) {
    try {
      const arrOfProdIDs = await promises;

      const arrofPromisedProducts = Calls.getRelatedProductsWithIDs(arrOfProdIDs.data);
      const arrayOfProducts = await Promise.all(arrofPromisedProducts);
      const arrOfPromisedStyles = Calls.getProductStyleByIDs(arrOfProdIDs.data);
      const arrayOfStyles = await Promise.all(arrOfPromisedStyles);
      // console.log(arrayOfStyles);
      const returnedStyles = arrayOfStyles.map((results) => results.data);
      const returnedProducts = arrayOfProducts.map((results) => (results.data));

      for (let i = 0; i < returnedStyles.length; i += 1) {
        returnedProducts[i].results = returnedStyles[i].results;
      }

      res.status(200).json(returnedProducts);
    } catch (err) {
      console.log('Error: ', err);
      res.status(500).send(err);
    }
  }
  resolves(promise);
});

app.get('/favorites', (req, res) => {
  const { favoriteIDS } = req.query;
  async function resolves(favIDS) {
    try {
      const arrofPromisedProducts = Calls.getRelatedProductsWithIDs(favIDS);

      const arrayOfProducts = await Promise.all(arrofPromisedProducts);
      const arrOfPromisedStyles = Calls.getProductStyleByIDs(favIDS);
      const arrayOfStyles = await Promise.all(arrOfPromisedStyles);
      const returnedStyles = arrayOfStyles.map((results) => results.data);

      const returnedProducts = arrayOfProducts.map((results) => (results.data));

      for (let i = 0; i < returnedStyles.length; i += 1) {
        returnedProducts[i].results = returnedStyles[i].results;
      }

      res.status(200).json(returnedProducts);
    } catch (err) {
      console.log('Error: ', err);
      res.status(500).send(err);
    }
  }
  resolves(favoriteIDS);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


// const query1 = `SELECT * FROM reviews
// INNER JOIN Photos ON Photos.review_id = Reviews.id
// WHERE product_id=${req.query.product_id}
// ${sortBy}
// LIMIT ${req.query.count};`;


