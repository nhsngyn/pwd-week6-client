// src/contexts/AuthContext.jsx
import React, { useState, useEffect } from 'react';
// 👇 새로 만든 파일에서 Context 객체와 훅을 가져옵니다.
import { AuthContext } from './auth';
import { authApi } from '../services/authApi'; // authApi 경로는 실제 프로젝트에 맞게 확인하세요.

// 👇 AuthProvider 컴포넌트만 내보냅니다.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 자동 로그인 상태 확인
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getCurrentUser();
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인
  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
        console.error('로그인 실패:', error);
      return { success: false, message: '로그인 중 오류가 발생했습니다.' };
    }
  };

  // 회원가입
  const register = async (name, email, password) => {
    try {
      const response = await authApi.register(name, email, password);
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
        console.error('회원가입 실패:', error);
      return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // 관리자 권한 확인
  const isAdmin = () => {
    return user && user.userType === 'admin';
  };

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    isAdmin,
    checkAuthStatus
  };

  // 가져온 AuthContext를 사용합니다.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 👇 useAuth 훅은 auth.js에서 내보내므로 여기서 export할 필요가 없습니다.
// export { useAuth }; // 이 줄은 삭제하거나 주석 처리합니다.