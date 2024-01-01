import { useContext, useState } from 'react';
import { places } from '../../assets';
import { getImageUrl } from '../../utils';
import { Place } from '../../interfaces';
import '../../css/ContextInImageSize.css';
import { ImageSizeContext } from '../../context/Context';

// For more Read:  https://react.dev/learn/passing-data-deeply-with-context
export const ContextInImageSize = () => {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <div style={{ width: '90vh', height: '90vh' }}>
      <>
        <ImageSizeContext.Provider value={imageSize}>
          <label>
            <input
              type="checkbox"
              checked={isLarge}
              onChange={(e) => {
                setIsLarge(e.target.checked);
              }}
            />
            Use large images
          </label>
          <hr />
          <List />
        </ImageSizeContext.Provider>
      </>
    </div>
  );
};

const List = () => {
  const listItems = places.map((place) => (
    <li key={place.id}>
      <Location place={place} />
    </li>
  ));
  return <ul>{listItems}</ul>;
};

const Location = ({ place }: { place: Place }) => {
  return (
    <>
      <LocationImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
};

const LocationImage = ({ place }: { place: Place }) => {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
};
