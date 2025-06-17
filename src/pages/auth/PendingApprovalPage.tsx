import { useNavigate } from "react-router-dom";
import Button from "../../components/shared/Button";

const PendingApprovalPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4'>
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>승인 대기 중</h2>
      <p className='text-gray-600 mb-4'>
        관리자 승인을 기다리고 있습니다. 승인 후 서비스를 이용하실 수 있습니다.
      </p>
      <p className='text-sm text-gray-400 mb-6'>
        문의가 필요하다면 담당 관리자에게 연락해주세요.
      </p>

      <Button onClick={handleGoHome}>메인으로 돌아가기</Button>
    </div>
  );
};

export default PendingApprovalPage;
