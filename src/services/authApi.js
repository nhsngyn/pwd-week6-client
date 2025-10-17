import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pwd-week5-nhsngyn.onrender.com', // 서버 주소
  withCredentials: true, // 👈 이 옵션을 반드시 추가해야 합니다.
});

export default api;