import { toast, ToastOptions } from 'react-toastify';
import { Place } from './interfaces';

import Cookies from 'js-cookie';

export function getImageUrl(place: Place) {
  return 'https://i.imgur.com/' + place.imageId + 'l.jpg';
}
export const showToast = (
  type: 'info' | 'success' | 'warning' | 'error',
  message: string,
  options: ToastOptions = {}
) => {
  const defaultOptions: ToastOptions = {
    autoClose: 3000,
    position: 'top-right',
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options,
  };

  switch (type) {
    case 'info':
      toast.info(message, defaultOptions);
      break;
    case 'success':
      toast.success(message, defaultOptions);
      break;
    case 'warning':
      toast.warn(message, defaultOptions);
      break;
    case 'error':
      toast.error(message, defaultOptions);
      break;
    default:
      toast(message, defaultOptions);
  }
};
export const setAuthTokenCookie = (
  token: string,
  expirationTimeInMinutes: number
): void => {
  const expirationDate = new Date();
  expirationDate.setMinutes(
    expirationDate.getMinutes() + expirationTimeInMinutes
  );

  Cookies.set('token', token, {
    expires: expirationDate,
    secure: true, // Ensure the cookie is only sent over HTTPS
    sameSite: 'Strict', // Enforce strict same-site policy
    path: '/', // Set the cookie to be accessible from any path on the domain
  });
};

export const getAuthTokenFromCookie = (): string | undefined => {
  return Cookies.get('token');
};

export const removeAuthTokenCookie = (): void => {
  Cookies.remove('token', { path: '/' });
};
