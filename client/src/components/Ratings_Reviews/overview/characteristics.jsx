import React from 'react';
import _ from 'underscore';
import styled from 'styled-components';
import CharacteristicItem from './characteristicItem.jsx';

const CharacteristicsList = styled.div`
  margin-bottom: 20px;
  border-top: 1px solid;
  border-color: rgb(238, 238, 238);
`;

const Title = styled.div`
  font-size: 20px;
  margin-bottom: 5px;
`;

const CharacteristicsBreakdown = ({ characteristics, characteristicsRatings, characteristics2 }) => {
  // console.log('characteristics2', characteristics);
  // console.log('characteristics3', characteristics2);
  // console.log('characteristicsRatings', characteristicsRatings);

  const charsArr = [];
  let counter = 0;
  _.each(characteristics, (val, key) => {
    console.log({ key }, 'the keyskeys');
    // console.log(index, 'this should be index');
    charsArr.push({ key, val: val.value, id: val.id, thisCharacteristic:characteristics2, characteristicsRatings:characteristicsRatings });
    counter++;
    console.log(counter);
  });
  console.log(charsArr, 'chararr');
  return (
    <CharacteristicsList>
      {/* <Title>Item Specific</Title> */}
      {charsArr.map((item) => <CharacteristicItem key={item.id} name={item.key} val={item.val} thisCharacteristic={item.thisCharacteristic} characteristicsRatings={item.characteristicsRatings} />)}
    </CharacteristicsList>
  );
};

export default CharacteristicsBreakdown;
