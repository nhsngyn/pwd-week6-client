// src/services/api.jsx (수정 완료)

import axios from 'axios';
// 👇 Vercel 환경 변수를 읽어오기 위해 environment.js를 import
import { environment } from '../config/environment';

// Axios 인스턴스 생성
const api = axios.create({
  // 👇 가짜 API가 아닌, 실제 Render 백엔드 주소를 사용
  baseURL: environment.API_URL, 
  timeout: 10000,
  // (참고) authApi.js와 달리 'withCredentials'가 없습니다.
  // 이 API들은 인증이 필요 없는 API용입니다.
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    console.log('API 요청:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API 에러:', error);
    return Promise.reject(error);
  }
);

// API 함수들
export const restaurantAPI = {
  // 👇 가짜 데이터 대신 실제 API를 호출
  getRestaurants: async () => {
    // (백엔드에 구현된 실제 엔드포인트)
    return api.get('/api/restaurants'); 
  },

  // 👇 가짜 데이터 대신 실제 API를 호출
  getRestaurantById: async (id) => {
    return api.get(`/api/restaurants/${id}`);
  },

  // 👇 가짜 데이터 대신 실제 API를 호출
  getPopularRestaurants: async () => {
    return api.get('/api/restaurants/popular');
  }
};

// submissionAPI 객체를 생성하고 'export' 합니다.
export const submissionAPI = {
  // 👇 가짜 데이터 대신 실제 API를 호출
  submitRestaurant: async (restaurantData) => {
    console.log("Submitting to backend:", restaurantData);
    
    // (중요!) 
    // 맛집 제보 API(/api/submissions)는 로그인이 필요할 수 있습니다.
    // 만약 로그인이 필요하다면, 이 함수는 api.jsx가 아니라
    // 'authApi.js'의 'apiClient'를 사용해야 합니다.
    
    // 일단은 'api' (인증 없는) 인스턴스를 사용한다고 가정합니다.
    return api.post('/api/submissions', restaurantData);
  },
  
  // (이하 백엔드에 구현된 기능에 맞춰 추가)
  // getSubmissions: async () => { ... }
  // approveSubmission: async (id) => { ... }
  // rejectSubmission: async (id) => { ... }
};

export default api;