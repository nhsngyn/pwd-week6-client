// src/config/environment.js (수정 완료)

// 환경별 설정 관리
const environment = {
  // API URL 설정
  API_URL: import.meta.env.VITE_API_URL || 'https://pwd-week6-server-v2.onrender.com',
  
  // 클라이언트 URL 설정
  CLIENT_URL: import.meta.env.VITE_CLIENT_URL || 'https://pwd-week6-client-delta.vercel.app',
  
  // 환경 모드
  NODE_ENV: import.meta.env.NODE_ENV || 'production',
  
  // 개발 환경 여부
  isDevelopment: import.meta.env.NODE_ENV === 'development',
  
  // 프로덕션 환경 여부
  isProduction: import.meta.env.NODE_ENV === 'production'
};

// 👇 [수정] import { environment } from ... 대신
// import environment from ... 로 쉽게 쓸 수 있게 default export로 변경
export default environment;