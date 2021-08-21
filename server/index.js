const express = require('express');
const axios = require('axios');
const path = require('path');
const config = require('../config');
const Calls = require('../api');

const app = express();
const port = 3000;

//reviews?sort=newest&product_id=41555&count=100

const pg = require('pg');
const keys = require('./config.js');
const { Pool } = require('pg');
var config1 = {
  user: 'postgres',
  database: 'stellar',
  password: keys.key,
  host: '3.137.191.251',
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
    res.status(200).send({ results: hel.rows });

  }).catch((err) => console.log('Error in productsDB', err))

});


app.get('/reviews/characteristics', (req, res) => {

  //left join

  console.log(req.query, 'characteristics');
  const query1 = `SELECT * FROM characteristics
  WHERE product_id=${req.query.product_id};`;
  console.log(query1, 'query1');
  pool.query(query1).then((hel) => {
    let shell = hel;

    console.log({ results: hel.rows }, 'hel');
    res.status(200).send({ results: hel.rows });

  }).catch((err) => console.log('Error in productsDB', err))

});

app.get('/loaderio-49dd9e0618ec4f92d8b48b6bafa519fb', (req, res) => {
  res.send("loaderio-49dd9e0618ec4f92d8b48b6bafa519fb")

});



app.get('/reviews/meta', (req, res) => {
  console.time("answer time");

  // console.log(req.query.product_id, 'AAAA');
  const metaQuery = `SELECT * FROM reviews
  LEFT JOIN characteristicsreviews ON reviews.id=characteristicsreviews.review_id
  LEFT JOIN Characteristics ON Characteristics.id=characteristicsreviews.characteristic_id

  WHERE reviews.product_id=${req.query.product_id}
  LIMIT ${20};`;

  // console.log(metaQuery, 'this is metaquery');
  pool.query(metaQuery).then((hel) => {
    let characteristics = {};
    for (var i = 0; i < hel.rows.length; i++) {
      characteristics[hel.rows[i].name] = { id: hel.rows[i].characteristic_id, value: 0 };
    }
    let counter = Object.keys(characteristics).length;


    // console.log(counter, 'counter');
    // console.log(hel.rows, 'hellt');
    // console.log(hel.rows, 'hellt');
    let ratingsObject = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let recommended = { false: 0, true: 0 };
    let keysOfquality = Object.keys(characteristics)

    for (var i = 0; i < hel.rows.length; i++) {
      ratingsObject[hel.rows[i].rating] += (1 / counter);
      if (hel.rows[i].recommend) {
        recommended.true += (1 / counter);
      } else {
        recommended.false += (1 / counter);
      }
      for (var j = 0; j < counter; j++) {
        // console.log(characteristics[keysOfquality[j]].id === hel.rows[i].id, 'should be the keys');
        if (characteristics[keysOfquality[j]].id === hel.rows[i].id) {
          characteristics[keysOfquality[j]].value += (hel.rows[i].value / (20 / counter));
        }
      }
    }
    let finalConstruct = {
      product_id: req.query.product_id,
      ratings: ratingsObject,
      recommended: recommended,
      characteristics: characteristics,
    }
    console.timeEnd("answer time");
    res.status(200).send(finalConstruct);
  })

});


app.get('/reviews/characteristicsreviews', (req, res) => {


  function doSomethingAsync(value) {
    // console.log(JSON.parse(req.query.characteristicsreviewsID), 'characteristicsshel')
    // console.log(value, 'aaaaaa');

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
    console.log(listCharacter, 'this needs to be grapped for testing');
    const promises = [];

    for (let i = 0; i < listCharacter.length; ++i) {
      promises.push(doSomethingAsync(listCharacter[i]));
    }

    Promise.all(promises)
      .then((results) => {
        // console.log("All done", results);
        res.status(200).send(results);

      })
      .catch((e) => {
        // Handle errors here
      });
  }

  test();

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

  //   INSERT INTO table_name(column1, column2, …)
  // VALUES (value1, value2, …);

  const query1 = `INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
  VALUES (${req.body.product_id}, ${req.body.rating}, ${'111111'},'${req.body.summary}','${req.body.body}',${req.body.recommend}, '${req.body.name}','${req.body.email}');`;
  console.log(query1, 'query1');
  pool.query(query1).then((hel) => {
    console.log('fish');
    console.log(hel, 'helll');
    console.log('fihs');
    // res.status(200).send({ results: hel.rows });

  }).catch((err) => console.log('Error in productsDB', err))

  res.send('sdf');

  // {
  //   product_id: 41355,
  //   rating: 3,
  //   summary: 'sdf',
  //   body: 'adfadsfsdf',
  //   recommend: false,
  //   name: 'Jesse Chung',
  //   email: 'jessemchung1@gmail.com',
  //   photos: [],
  //   characteristics: {}
  // }


  // axios.post('/reviews', req.body)
  //   .then((results) => {
  //     res.send(results);
  //   })
  //   .catch((err) => {
  //     res.send(err);
  //   });
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  console.log(req.params, 'query in helpful');

  console.log(req.params.review_id, 'query in helpful');


  const query2 = `UPDATE reviews
  SET helpfulness = helpfulness+1
  WHERE id=${req.params.review_id};`;

  console.log(query2, 'this needs to be reworked');
  pool.query(query2).then((hel) => {
    // console.log('fish');
    // console.log(hel, 'helll');
    // console.log('fihs');
    // res.status(200).send({ results: hel.rows });
    res.send('sdf');


  }).catch((err) => console.log('Error in productsDB', err))





  // axios.put(`/reviews/${req.params.review_id}/helpful`)
  //   .then((results) => {
  //     res.send(results.data);
  //   })
  //   .catch((err) => {
  //     res.send(err);
  //   });
});

app.put('/reviews/:review_id/report', (req, res) => {


  const query2 = `UPDATE reviews
  SET report = true
  WHERE id=${req.params.review_id};`;

  console.log(query2, 'this needs to be reworked');
  pool.query(query2).then((hel) => {
    console.log('fish');
    console.log(hel, 'helll');
    console.log('fihs');
    // res.status(200).send({ results: hel.rows });
    res.send('sdf');


  }).catch((err) => console.log('Error in productsDB', err))

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


