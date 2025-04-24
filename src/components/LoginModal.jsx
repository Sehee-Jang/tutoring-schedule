import React, { useState, useEffect } from "react";
import { login } from "../services/auth";
import { useAuth } from "../context/AuthContext";

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      onClose(); // 로그인 성공 시 모달 닫기
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative'>
        <h2 className='text-xl font-bold mb-4 text-center'>관리자 로그인</h2>
        {error && (
          <p className='text-red-500 text-sm mb-3 text-center'>{error}</p>
        )}
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <input
            type='email'
            placeholder='이메일'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border px-3 py-2 rounded'
          />
          <input
            type='password'
            placeholder='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border px-3 py-2 rounded'
          />
          <button
            type='submit'
            className='bg-blue-600 text-white py-2 rounded hover:bg-blue-500'
          >
            로그인
          </button>
        </form>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-400 hover:text-gray-600'
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
