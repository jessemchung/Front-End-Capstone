import React, { useState } from 'react';
import styled from 'styled-components';
import StarRatings from 'react-star-ratings';
import PropTypes from 'prop-types';
import StarsBreakdown from './starsbreakdown.jsx';
import CharacteristicsBreakdown from './characteristics.jsx';

console.log('someting');

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
`;

const RatingWrapper = styled.div`
  display: flex;
`;

const Rating = styled.div`
  display: inline-block;
  font-size: xx-large;
  padding-right: 3px;
`;

const Recommends = styled.div`
  font: small Georgia, serif;
  padding-bottom: 25px;
  margin-top: 15px;
  border-bottom: 1px solid rgb(238, 238, 238);
`;

let totalRatingsCount = 0;

const averageRating = (ratings) => {
  totalRatingsCount = 0;
  let subtotal = 0;
  let n = 1;
  while (n < 6) {
    if (ratings[n]) {
      totalRatingsCount += Number(ratings[n]);
      subtotal += n * Number(ratings[n]);
    }
    n++;
  }
  return Math.round(subtotal / totalRatingsCount * 10) / 10;
};

let rating;

export const Overview = ({ metaData, characteristicsRatings, characteristics }) => {
  console.log(metaData, 'what is in here metaData');
  const usersRecommendedCalculator = (data) => {
    console.log(data, 'this should be correct');
    let recommendedStr;
    if (!data.true) {
      recommendedStr = 'No Recommendations Yet!';
      return recommendedStr;
    }
    if (!data.false) {
      data.false = 0;
    }
    const percent = Math.round(Number(data.true) / (Number(data.true) + Number(data.false)) * 100);
    recommendedStr = `${percent}% of reviews recommend this product`;
    return recommendedStr;
  };

  rating = averageRating(metaData.ratings);
  let ratingStr;
  if (!rating) {
    ratingStr = 'No Reviews Yet!';
  } else {
    ratingStr = `${rating}`;
  }
  console.log(rating, 'this is rating');
  console.log(characteristicsRatings, 'crating');
  console.log(characteristics, 'characteristics');

  return (
    <Container>
      <RatingWrapper>
        <Rating>
          {ratingStr}
        </Rating>
        <StarRatings
          rating={3}
          starRatedColor="gold"
          starDimension="15px"
          starSpacing="0"
          numberOfStars={5}
          name="rating"
        />
      </RatingWrapper>
      <Recommends>
        hello
        {usersRecommendedCalculator(metaData.recommended)}
      </Recommends>
      <StarsBreakdown ratings={metaData.ratings} totalRatings={totalRatingsCount} />
      <CharacteristicsBreakdown characteristics={metaData.characteristics} characteristics2={characteristics} characteristicsRatings={characteristicsRatings} />
    </Container>
  );
};

export const rate = () => [rating, totalRatingsCount];

export default { Overview, rate };
