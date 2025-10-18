// src/contexts/auth.js
import { createContext, useContext } from 'react';

// Context 객체 생성 및 내보내기
export const AuthContext = createContext(null);

// 커스텀 훅 생성 및 내보내기
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.');
  }
  return context;
};