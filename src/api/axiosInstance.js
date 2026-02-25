import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // 스프링 부트 서버 주소
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
