import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div>
      <p className='text-sm mt-4 text-center'>
        아직 계정이 없으신가요?{" "}
        <Link to='/signup' className='text-blue-600 hover:underline'>
          회원가입하기
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
