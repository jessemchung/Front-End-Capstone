import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { Overview } from './overview/overview.jsx';
import ReviewList from './reviewList/reviewlist.jsx';
import MetaContext from './context/MetaContext.js';
import BigContext from './context/BigContext.js';
import { ProductsContext } from '../globalState.jsx';

const OuterContainer = styled.div`
  margin: auto;
  width: 1000px;
  color: #0f0f0fdc;
  font-family: Arial;
`;

const Container = styled.div`
  display: flex;
  margin: auto;
  width: 1000px;
`;

const Header = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-left: 20px;
`;

const RatingsAndReviews = () => {
  const [productData, setProductData] = useState(undefined);
  const [productMetaData, setProductMetaData] = useState(undefined);
  const [sortType, setSortType] = useState('newest');
  const [ratingFilter, setRatingFilter] = useState([]);
  const [reviewSubmit, setReviewSubmit] = useState(false);
  const [products, setProducts] = useContext(ProductsContext);
  const [characteristics, setCharacteristics] = useState([]);
  const [characteristicsRatings, setCharacteristicsRatings] = useState([]);


  useEffect(() => {
    console.log('useing');
    axios.get('/reviews', {
      params: { product_id: products.currentItemId, sort: sortType, count: 100 },
    })
      .then((reviewsResults) => {
        console.log(reviewsResults.data, 'mine');
        setProductData(reviewsResults.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sortType, products, reviewSubmit]);

  useEffect(() => {
    axios.get('/reviews/meta', {
      params: { product_id: products.currentItemId },
    })
      .then((results) => {
        console.log(results.data, 'setProductMetaData');
        setProductMetaData(results.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [products]);

  useEffect(() => {
    console.log('characteristics')
    axios.get('/reviews/characteristics', {
      params: { product_id: products.currentItemId },
    })
      .then((results) => {
        // console.log(results.data, 'characteristics results');
        // console.log(results.data.results[0].id, 'shit');
        setCharacteristics(results.data);

        axios.get('/reviews/characteristicsreviews', {
          params: { characteristicsreviewsID: JSON.stringify(results.data.results) },
        })
          .then((results) => {
            console.log(results.data, 'characteristics results');
            setCharacteristicsRatings(results.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log('productData', productData);

//overview metadata needs to be adjusted
  if (productMetaData && productData) {
    return (

      <OuterContainer>
        <Header>Ratings and Reviews</Header>
        <Container>
          <BigContext.Provider value={{ productData, productMetaData, ratingFilter, setRatingFilter, reviewSubmit, setReviewSubmit }}>
            <Overview metaData={productMetaData} characteristicsRatings={characteristicsRatings} characteristics={characteristics} />
            <MetaContext.Provider value={{ sortType, setSortType }}>
              <ReviewList reviews={productData} />
            </MetaContext.Provider>
          </BigContext.Provider>
        </Container>
      </OuterContainer>
    );
  }
  return null;
};

export default RatingsAndReviews;
