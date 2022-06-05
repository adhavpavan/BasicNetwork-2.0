import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
  baseURL: "http://113.174.169.248:4000/",
  headers: {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  paramsSerializer: params => queryString.stringify(params,{ arrayFormat: 'brackets', encode: false }),
});

export default axiosClient;