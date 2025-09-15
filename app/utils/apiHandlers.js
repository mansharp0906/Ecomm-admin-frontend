import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const isDevelopment = process.env.NODE_ENV !== 'production';
const isProductionApp = process.env.APP_ENV === 'production';

export const isLoggedIn = () => {
  return Boolean(
    Cookies.get(
      isDevelopment || isProductionApp
        ? '__user__isLoggedIn'
        : `${process.env.APP_ENV}__user__isLoggedIn`,
    ),
  );
};

export const showErrorMessage = (message) => {
  if (message instanceof Array) {
    message.forEach((msg) => toast.error(msg));
  } else {
    toast.error(message);
  }
};

const responseFormatter = (status, data, error) => {
  return { status, data: data || null, error };
};

const handleApiError = (err) => {
  return responseFormatter(false, null, err.response.data);
};

export const postReq = async (endpoint, data) => {
  const url = process.env.API_URL + endpoint;

  return await axios
    .post(url, data, { withCredentials: true })
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((err) => {
      return handleApiError(err);
    });
};

export const patchReq = async (endpoint, data) => {
  const url = process.env.API_URL + endpoint;

  return await axios
    .patch(url, data, { withCredentials: true })
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((err) => {
      return handleApiError(err);
    });
};

export const getReq = async (endpoint) => {
  const url = process.env.API_URL + endpoint;

  return await axios
    .get(url, { withCredentials: true })
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((err) => {
      return handleApiError(err);
    });
};
