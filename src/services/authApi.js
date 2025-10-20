// src/services/authApi.js

import axios from 'axios';
import  environment  from '../config/environment';

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

// 401 예외 처리할 경로 목록 (이 경로들은 401이 발생해도 로그인 페이지로 튕겨내지 않음)
const authPathsToIgnore = ['/me', '/login', '/register'];

// 응답 인터셉터 - 세션 만료 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    
    // 1. 401 에러(인증 오류)가 발생했는지 먼저 확인합니다.
    if (error.response?.status === 401) {
      
      // 2. 401 에러가 발생한 요청이 /me, /login, /register 중 하나인지 확인
      const isAuthPath = authPathsToIgnore.some(path => error.config.url.endsWith(path));

      if (isAuthPath) {
        // 이 3개 경로에서 발생한 401은 리다렉션하지 않고,
        // AuthContext나 폼이 에러를 처리하도록 그냥 반환합니다.
        return Promise.reject(error);
      }
      
      // 3. 그 외 API(예: 글쓰기)에서 401이 발생하면 세션 만료이므로 로그인 페이지로 보냅니다.
      // (현재 창이 이미 로그인 페이지가 아닐 경우에만 이동)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error); // 리다이렉트 후에도 프로미스를 중단합니다.
    }
    
    // 4. 401이 아닌 다른 모든 에러(400, 404, 500 등)는
    //    폼에서 에러 메시지를 표시할 수 있도록 그냥 반환합니다.
    return Promise.reject(error);
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