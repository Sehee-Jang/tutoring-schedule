"use client";

import React, { useState, useEffect } from "react";
import { login } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import ModalLayout from "../../components/shared/ModalLayout";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";
import { isAdminRole } from "../../utils/roleUtils";
// import { loginWithGoogle } from "@/services/auth";

// const handleGoogleLogin = async () => {
//   try {
//     await loginWithGoogle();
//   } catch (err) {
//     console.error("Google 로그인 실패:", err);
//   }
// };

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen }: LoginModalProps) => {
  const { closeModal, showModal } = useModal();

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user) {
      closeModal(); // 로그인 성공 시 모달 닫기

      // 로그인 후 역할에 따라 리디렉션
      if (isAdminRole(user.role)) {
        navigate("/admin");
      } else if (user.role === "tutor") {
        navigate("/tutor");
      }
    }
  }, [user, closeModal, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      // 성공
      toast({
        title: "로그인 성공",
        variant: "default",
      });
    } catch (err) {
      console.error("이메일 또는 비밀번호가 올바르지 않습니다.", err);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSignupClick = () => {
    showModal("signup");
  };

  if (!isOpen) return null;

  return (
    <ModalLayout onClose={closeModal}>
      <h2 className='text-xl font-bold text-gray-700 mb-4 text-center'>
        관리자 로그인
      </h2>
      {error && (
        <p className='text-red-500 text-sm mb-3 text-center'>{error}</p>
      )}
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input
          type='email'
          placeholder='이메일'
          value={email}
          onChange={handleEmailChange}
          className='border text-gray-700  px-3 py-2 rounded'
        />
        <input
          type='password'
          placeholder='비밀번호'
          value={password}
          onChange={handlePasswordChange}
          className='border text-gray-700  px-3 py-2 rounded'
        />

        {/* 일반 로그인 버튼 */}
        <Button variant='primary' type="submit">로그인</Button>

        {/* 구글 로그인 버튼 */}
        {/* <button
          type='button'
          onClick={handleGoogleLogin}
          className='border px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600'
        >
          Google로 로그인
        </button> */}

        {/* 회원가입 버튼 */}
        <Button variant='outline' onClick={handleSignupClick}>
          회원가입
        </Button>
      </form>
    </ModalLayout>
  );
};

export default LoginModal;
