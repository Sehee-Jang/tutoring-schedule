import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { Tutor } from "../../types/tutor";
import { useToast } from "../../hooks/use-toast";
import { Switch } from "../../components/ui/switch";
import TutorFormModal from "../../components/admin/tutors/TutorFormModal";
import { useFetchTutors } from "../../hooks/useFetchTutors";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { logout } from "../../services/auth";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { tutors, loading, error } = useFetchTutors();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  // const handleCreate = () => {
  //   setModalMode("create");
  //   setSelectedTutor(null);
  //   setIsModalOpen(true);
  // };

  const handleEdit = (tutor: Tutor) => {
    setModalMode("edit");
    setSelectedTutor(tutor);
    setIsModalOpen(true);
  };

  const toggleTutorStatus = async (tutor: Tutor) => {
    try {
      const tutorRef = doc(db, "users", tutor.id);
      const currentStatus = tutor.status || "inactive";
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await updateDoc(tutorRef, { status: newStatus });
      toast({
        title: `튜터가 ${
          newStatus === "active" ? "활성화" : "비활성화"
        }되었습니다.`,
        variant: "default",
      });
    } catch (error) {
      console.error("튜터 상태 변경 오류:", error);
      toast({
        title: "튜터 상태 변경에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (name: string, email: string) => {
    try {
      if (modalMode === "create") {
        await addDoc(collection(db, "tutors"), {
          name,
          email,
          status: "active",
        });
      } else if (modalMode === "edit" && selectedTutor) {
        const tutorRef = doc(db, "tutors", selectedTutor.id);
        await updateDoc(tutorRef, { name, email });
      }
      setIsModalOpen(false);
      // fetchTutors 필요 없음! 자동 갱신됨
    } catch (err) {
      console.error("튜터 추가/수정 오류:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <ProtectedRoute requiredRole='admin'>
      <div className='max-w-3xl mx-auto p-8'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>튜터 관리</h1>

          {error && (
            <div className='bg-red-100 text-red-700 p-4 mb-4 rounded'>
              {error}
            </div>
          )}

          <button
            onClick={handleLogout}
            title='로그아웃'
            className='hover:text-black'
          >
            <LogOut className='w-5 h-5' />
          </button>
        </div>

        {/* <div className='flex justify-end mb-4'>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          onClick={handleCreate}
        >
          튜터 추가
        </button>
      </div> */}

        {loading ? (
          <div className='text-center py-10'>Loading...</div>
        ) : (
          // <ul className='space-y-4'>
          //   {tutors.map((tutor) => (
          //     <li
          //       key={tutor.id}
          //       className='flex justify-between items-center border p-4 rounded'
          //     >
          //       <div>
          //         <div className='font-semibold'>{tutor.name}</div>
          //         <div className='text-gray-600 text-sm'>{tutor.email}</div>
          //       </div>
          //       <div className='flex items-center space-x-4'>
          //         {/* 토글 스위치 */}
          //         <Switch
          //           checked={tutor.status === "active"}
          //           onCheckedChange={() => toggleTutorStatus(tutor)}
          //         />
          //         {/* 수정 버튼 그대로 */}
          //         <button
          //           className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm'
          //           onClick={() => handleEdit(tutor)}
          //         >
          //           수정
          //         </button>
          //       </div>
          //     </li>
          //   ))}
          // </ul>
          <ul className='space-y-4'>
            {tutors.map((tutor) => (
              <li
                key={tutor.id}
                className='flex justify-between items-center border p-4 rounded'
              >
                <div>
                  <div className='font-semibold flex items-center'>
                    {tutor.name}
                    {tutor.status === "pending" && (
                      <span className='ml-2 text-yellow-500 text-sm'>
                        (승인 대기)
                      </span>
                    )}
                  </div>
                  <div className='text-gray-600 text-sm'>{tutor.email}</div>
                </div>
                <div className='flex items-center space-x-4'>
                  <Switch
                    checked={tutor.status === "active"}
                    onCheckedChange={() => toggleTutorStatus(tutor)}
                  />
                  <button
                    className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm'
                    onClick={() => handleEdit(tutor)}
                  >
                    수정
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <TutorFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialName={selectedTutor?.name}
          initialEmail={selectedTutor?.email}
          mode={modalMode}
        />
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;
