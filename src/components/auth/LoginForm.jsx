import React, { useState } from "react";
import { login } from "../../services/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      // 로그인 성공 시 AuthContext에서 자동으로 상태 업데이트됨
    } catch (err) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
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
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='비밀번호'
          className='border px-3 py-2 rounded'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type='submit'
          className='bg-blue-600 text-white py-2 rounded hover:bg-blue-500'
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
