import { useState } from "react";
import { createAdminAccount } from "../../services/adminSetup";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const CreateAdminPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleCreateAdmin = async () => {
    setLoading(true);
    try {
      await createAdminAccount(email, password);
      toast({
        title: "관리자 계정이 생성되었습니다.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "관리자 계정 생성에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto mt-10 p-8 border rounded'>
      <h1 className='text-2xl font-bold mb-4'>관리자 계정 생성</h1>
      <input
        type='email'
        placeholder='관리자 이메일'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='mb-4 w-full p-2 border rounded'
      />
      <input
        type='password'
        placeholder='비밀번호'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='mb-4 w-full p-2 border rounded'
      />
      <button
        onClick={handleCreateAdmin}
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full'
        disabled={loading}
      >
        {loading ? "생성 중..." : "관리자 계정 생성"}
      </button>

      <div className='flex flex-row justify-between p-4'>
        <button
          onClick={() => navigate("/")}
          className='text-sm text-gray-500 hover:text-gray-700 underline'
        >
          ← 메인으로 돌아가기
        </button>
        <button
          onClick={() => navigate("/admin")}
          className='text-sm text-gray-500 hover:text-gray-700 underline'
        >
          ← 관리자페이지 바로가기
        </button>
      </div>
      <div></div>
    </div>
  );
};

export default CreateAdminPage;
