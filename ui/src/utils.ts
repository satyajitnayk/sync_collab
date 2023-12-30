import { Place } from './interfaces';

export function getImageUrl(place: Place) {
  return 'https://i.imgur.com/' + place.imageId + 'l.jpg';
}
