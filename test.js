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
});


function doSomethingAsync(value) {
  // console.log(JSON.parse(req.query.characteristicsreviewsID), 'characteristicsshel')
  // console.log(value, 'aaaaaa');

  return new Promise((resolve) => {
    const query1 = `SELECT * FROM Characteristicsreviews
      WHERE characteristic_id=${value.id};`;

    pool.query(query1).then((hel) => {
      let shell = hel;
      resolve(hel.rows);
    })
  });
}

function test() {
  const listCharacter = [
    { id: 138384, product_id: 41355, name: 'Fit' },
    { id: 138385, product_id: 41355, name: 'Length' },
    { id: 138386, product_id: 41355, name: 'Comfort' },
    { id: 138387, product_id: 41355, name: 'Quality' }
  ];

  const promises = [];

  for (let i = 0; i < listCharacter.length; ++i) {
    promises.push(doSomethingAsync(listCharacter[i]));
  }

  Promise.all(promises)
    .then((results) => {
      console.timeEnd("answer time");

      // res.status(200).send(results);

    })
    .catch((e) => {
      // Handle errors here
    });
}

// Product Review Photos

//All products and all reviews

// Select all products
// left join the products and reviews
// left join the reviews and photos together


console.time("answer time");

test();




// app.get('/reviews/meta', (req, res) => {
//   console.log(req.query);

const metaQuery = `SELECT * FROM reviews
  LEFT JOIN characteristicsreviews ON reviews.id=characteristicsreviews.review_id
  LEFT JOIN Characteristics ON Characteristics.id=characteristicsreviews.characteristic_id

  WHERE reviews.product_id=41355
  LIMIT ${20};`;


console.log(metaQuery, 'this is metaquery');
pool.query(metaQuery).then((hel) => {
  let characteristics = {};
  for (var i = 0; i < hel.rows.length; i++) {
    characteristics[hel.rows[i].name] = {id: hel.rows[i].characteristic_id, value:0};


  }
  let counter = Object.keys(characteristics).length;


  console.log(counter, 'counter');
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
      recommended.true+=(1/counter);
    } else {
      recommended.false+=(1/counter);
    }
    for (var j = 0; j<counter; j++) {
      console.log(characteristics[keysOfquality[j]].id===hel.rows[i].id, 'should be the keys');
      if(characteristics[keysOfquality[j]].id===hel.rows[i].id) {
        characteristics[keysOfquality[j]].value+=(hel.rows[i].value/(20/counter));
      }
    }
  }

  console.log(characteristics, 'fish legs are fun');

  console.log(ratingsObject, 'ratingsObject');
  console.log(recommended, 'recommended');
  let finalConstruct = {
    product_id:41355,
    ratings: ratingsObject,
    recommended: recommended,
    characteristics: characteristics,
  }
  console.log(finalConstruct);

})

//   .then(finalObject => {
//     //build recommended

//     const query1 = `SELECT recommend FROM reviews
// WHERE product_id=${req.query.product_id}
// LIMIT 5;`;

//     pool.query(query1).then((recommended) => {

//       // console.log(recommended.rows, 'recommended');
//       let recommendObject = { false: 0, true: 0 }
//       // console.log('recommended.rows.length',recommended.rows.length);
//       for (var recommend = 0; recommend < recommended.rows.length; recommend++) {
//         console.log(recommended.rows[recommend], 'this is not right')
//         if (recommended.rows[recommend].recommend) {
//           recommendObject.true++;
//         } else {
//           recommendObject.false++;
//         }

//       }
//       finalObject.recommended = recommendObject;
//       console.log(finalObject, 'this should have recommendObject changed');
//       return finalObject;

//     }).then((final) => {
//       res.send(finalObject)
//     });

//   }).catch((err) => console.log('Error in productsDB', err))


// // });