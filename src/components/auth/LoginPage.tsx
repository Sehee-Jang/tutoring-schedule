"use client";

import { useState } from "react";
import { login } from "../../services/auth";
import PrimaryButton from "../shared/PrimaryButton";
import { toast } from "../../hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import Button from "../shared/Button";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname;
  const target = from && from !== "/login" ? from : "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      });

      // 짧은 대기
      setTimeout(() => {
        const from = location.state?.from?.pathname;
        const target = from && from !== "/login" ? from : "/";
        navigate(target, { replace: true });
      }, 300);
    } catch (err) {
      console.error(err);
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      toast({
        title: "로그인 실패",
        description: "이메일 또는 비밀번호를 다시 확인해주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='p-10 text-center space-y-6 bg-white rounded-xl shadow max-w-md w-full'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>관리자 로그인</h2>

        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          {/* 이메일 & 비밀번호 입력란 */}
          <input
            type='email'
            placeholder='이메일'
            className='border px-3 py-2 rounded'
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type='password'
            placeholder='비밀번호'
            className='border px-3 py-2 rounded'
            value={password}
            onChange={handlePasswordChange}
          />

          {/* 로그인 & 회원가입 버튼 */}
          <PrimaryButton type='submit' disabled={loading}>
            로그인
          </PrimaryButton>
          <Button variant='outline' onClick={() => showModal("signup")}>
            회원가입
          </Button>
        </form>
        {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
