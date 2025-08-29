import axios from "./axios.customize";
const BASE_URL = "/v1/api";
const createUserAPI = (name: string, email: string, password: string) => {
  return axios.post(`${BASE_URL}/register`, {
    name,
    email,
    password,
  });
};

const loginUserAPI = (email: string, password: string) => {
  return axios.post(`${BASE_URL}/login`, {
    email,
    password,
  });
};

const getUserAPI = () => {
  return axios.get(`${BASE_URL}/user`);
};

export { createUserAPI, loginUserAPI, getUserAPI };
