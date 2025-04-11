import axios from "axios";

const BASE_URL = "https://api-test.buymore.fun/usurper";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});
