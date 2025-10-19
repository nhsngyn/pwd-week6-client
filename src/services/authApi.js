// src/services/authApi.js

import axios from 'axios';
import { environment } from '../config/environment';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: `${environment.API_URL}/api/auth`,
  withCredentials: true, // 쿠키 포함 요청
  timeout: 10000,
});

// 요청 인터셉터 - 쿠키 자동 포함
apiClient.interceptors.request.use(
  (config) => {
    // withCredentials: true로 설정되어 있어 쿠키가 자동으로 포함됨
    console.log('API 요청:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 세션 만료 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config.url === '/me') {
       return Promise.reject(error);
  }
  window.location.href = '/login';
}
);

// 인증 관련 API 함수들
export const authApi = {
  // 회원가입
  register: (name, email, password) => 
    apiClient.post('/register', { name, email, password }),

// 로그인
login: (email, password) => 
    apiClient.post('/login', { email, password }),

  // 로그아웃
  logout: () => 
    apiClient.post('/logout'),

  // 현재 사용자 정보 조회
  getCurrentUser: () => 
    apiClient.get('/me'),

  // Google OAuth 로그인 URL 생성
  getGoogleAuthUrl: () => 
    apiClient.get('/google/url'),

  // Naver OAuth 로그인 URL 생성
  getNaverAuthUrl: () => 
    apiClient.get('/naver/url'),

  // OAuth 콜백 처리
  handleOAuthCallback: (provider, code) => 
    apiClient.post(`/${provider}/callback`, { code }),

  // 관리자 전용 API
  admin: {
    // 모든 사용자 목록 조회
    getUsers: () => 
      apiClient.get('/admin/users'),
    
    // 사용자 권한 변경
    updateUserType: (userId, userType) => 
      apiClient.put(`/admin/users/${userId}`, { userType }),
    
    // 사용자 삭제
    deleteUser: (userId) => 
      apiClient.delete(`/admin/users/${userId}`)
  }
};