import React, { useState } from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
`;

const MainImage = styled.img`
width: 600px;
height: 500px;
object-fit: cover;
box-shadow: 0 0 5px;
transition: 0.4s;
margin-left: 25px;
margin-right: 25px;
margin-top: 25px;
`;

const ExpandButton = styled.button`
background: rgba(255, 255, 255, 0.50);
width: 30px;
height: 30px;
border: none;
border-radius: 50%;
color: rgba(50, 50, 50);
font-size: 18px;
text-align: center;
cursor: pointer;
position: absolute;
top: 10%;
left: 10%;
`;

const ScrollMenu = styled.div`
position: absolute;
top: 450px;
left: 125px;
margin: auto;
width: 400px;
overflow-x: scroll;
white-space: nowrap;
`;

const ImagePreview = styled.input`
margin: 10px;
box-shadow: 0 0 3px;
width: 50px;
height: 50px;
object-fit: cover;
transition: 0.4s;
opacity: 0.3;
`;

const ProductDisplay = ({ currentStyle, mainImageKey, changeImage }) => {
  if (!currentStyle) {
    return (
      <div>
        <img
          src=""
          alt=""
          width="600px"
          height="500px"
        />
      </div>
    );
  }

  const [expanded, setExpand] = useState();
  const [expandIcon, setExpandIcon] = useState('✛');

  const handleExpand = () => {
    setExpand((prevState) => !prevState);
    if (expandIcon === '✛') {
      setExpandIcon('✕');
    } else {
      setExpandIcon('✛');
    }
  };

  const imageSelector = (e) => {
    changeImage(e.target.id);
  };

  const currentImage = currentStyle.photos[mainImageKey].url || currentStyle.photos[0].url;

  return (
    <div className="gallery">
      <ImageContainer>
        <MainImage
          src={currentImage}
          alt=""
          style={{
            transform: expanded ? 'scale(1.5)' : undefined,
            transformOrigin: expanded ? 'top left' : undefined,
          }}
        />
        <ExpandButton
          onClick={handleExpand}
        >
          {expandIcon}
        </ExpandButton>
        <ScrollMenu>
          {currentStyle.photos.map((image, key) => {
            if (image.url === currentImage) {
              return (
                <ImagePreview
                  type="image"
                  src={image.thumbnail_url}
                  alt=""
                  id={key}
                  key={key}
                  onClick={imageSelector}
                  style={{ opacity: 1 }}
                />
              );
            }
            return (
              <ImagePreview
                type="image"
                src={image.thumbnail_url}
                alt=""
                id={key}
                key={key}
                onClick={imageSelector}
              />
            );
          })}
        </ScrollMenu>
      </ImageContainer>
    </div>
  );
};

export default ProductDisplay;
