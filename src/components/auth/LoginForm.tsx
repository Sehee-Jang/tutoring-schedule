"use client";

import { useState } from "react";
import { login } from "../../services/auth";
import PrimaryButton from "../shared/PrimaryButton";
import { toast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

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

  return (
    <div className='max-w-sm mx-auto bg-white shadow rounded p-6 mt-4'>
      <h2 className='text-lg font-bold text-gray-800 mb-4'>관리자 로그인</h2>
      {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
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
        <PrimaryButton type='submit'>로그인</PrimaryButton>
      </form>
    </div>
  );
};

export default LoginForm;
