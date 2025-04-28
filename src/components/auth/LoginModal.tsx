"use client";

import React, { useState, useEffect } from "react";
import { login } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import ModalLayout from "../shared/ModalLayout";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      onClose(); // 로그인 성공 시 모달 닫기
    }
  }, [user, onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <ModalLayout onClose={onClose}>
      <h2 className='text-xl font-bold mb-4 text-center'>관리자 로그인</h2>
      {error && (
        <p className='text-red-500 text-sm mb-3 text-center'>{error}</p>
      )}
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input
          type='email'
          placeholder='이메일'
          value={email}
          onChange={handleEmailChange}
          className='border px-3 py-2 rounded'
        />
        <input
          type='password'
          placeholder='비밀번호'
          value={password}
          onChange={handlePasswordChange}
          className='border px-3 py-2 rounded'
        />
        <button
          type='submit'
          className='bg-[#262626] text-white py-2 rounded hover:bg-[#404040]'
        >
          로그인
        </button>
      </form>
    </ModalLayout>
  );
};

export default LoginModal;
