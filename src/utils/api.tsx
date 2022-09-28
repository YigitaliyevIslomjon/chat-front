import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/",
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    let access_token = localStorage.getItem("access_token");
    config.headers = {
      authorization: `Bearer ${access_token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default api;
