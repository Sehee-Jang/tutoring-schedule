"use client";

import { useState } from "react";
import { login } from "../../services/auth";
import { toast } from "../../hooks/use-toast";
import { Link } from "react-router-dom";
import Button from "../shared/Button";
import { loginWithGoogle } from "../../services/auth";
import { getRedirectPathForUser } from "../../utils/redirectUtils";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 로그인 성공 후 토스트 + 페이지 이동
  useEffect(() => {
    if (!user || isLoading) return;

    toast({
      title: "로그인 성공",
      description: "환영합니다!",
    });

    const targetPath = getRedirectPathForUser(user);
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  }, [user, isLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
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

  const handleGoogleLogin = async () => {
    if (googleLoading) return; // ✅ 중복 방지
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Google 로그인 실패:", err);
      toast({
        title: "로그인 실패",
        description: "Google 인증에 실패했습니다.",
        variant: "destructive",
      });
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
        <h2 className='text-xl font-bold text-gray-800 mb-4'>로그인</h2>

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
          <Button type='submit' variant='primary' disabled={loading}>
            로그인
          </Button>

          {/* 구글 로그인 버튼 */}
          <button
            type='button'
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className='border px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600'
          >
            Google로 로그인
          </button>

          {/* 회원가입 */}
          <Link to='/signup'>
            <Button variant='outline' size='sm' className=''>
              회원가입
            </Button>
          </Link>
        </form>
        {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
