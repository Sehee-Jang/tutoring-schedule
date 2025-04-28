import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Tutor } from "../../types/tutor";
import TutorFormModal from "../../components/tutor/TutorFormModal";

const TutorsPage = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tutors"),
      (snapshot) => {
        const tutorsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Tutor, "id">),
        }));
        setTutors(tutorsData);
        setLoading(false);
      },
      (error) => {
        console.error("튜터 목록 실시간 감지 실패:", error);
        setError("튜터 목록을 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // ✅ 컴포넌트 unmount 시 실시간 구독 해제
  }, []);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedTutor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tutor: Tutor) => {
    setModalMode("edit");
    setSelectedTutor(tutor);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const tutorRef = doc(db, "tutors", id);
      await deleteDoc(tutorRef);
      // fetchTutors 필요 없음! 자동 갱신됨
    } catch (err) {
      console.error("튜터 삭제 오류:", err);
      setError("튜터 삭제에 실패했습니다.");
    }
  };

  const handleSubmit = async (name: string, email: string) => {
    try {
      if (modalMode === "create") {
        await addDoc(collection(db, "tutors"), { name, email });
      } else if (modalMode === "edit" && selectedTutor) {
        const tutorRef = doc(db, "tutors", selectedTutor.id);
        await updateDoc(tutorRef, { name, email });
      }
      setIsModalOpen(false);
      // fetchTutors 필요 없음! 자동 갱신됨
    } catch (err) {
      console.error("튜터 추가/수정 오류:", err);
      setError("튜터 추가 또는 수정에 실패했습니다.");
    }
  };

  return (
    <div className='max-w-3xl mx-auto p-8'>
      <h1 className='text-2xl font-bold mb-6'>튜터 관리</h1>

      {error && (
        <div className='bg-red-100 text-red-700 p-4 mb-4 rounded'>{error}</div>
      )}

      <div className='flex justify-end mb-4'>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          onClick={handleCreate}
        >
          튜터 추가
        </button>
      </div>

      {loading ? (
        <div className='text-center py-10'>Loading...</div>
      ) : (
        <ul className='space-y-4'>
          {tutors.map((tutor) => (
            <li
              key={tutor.id}
              className='flex justify-between items-center border p-4 rounded'
            >
              <div>
                <div className='font-semibold'>{tutor.name}</div>
                <div className='text-gray-600 text-sm'>{tutor.email}</div>
              </div>
              <div className='space-x-2'>
                <button
                  className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'
                  onClick={() => handleEdit(tutor)}
                >
                  수정
                </button>
                <button
                  className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
                  onClick={() => handleDelete(tutor.id)}
                >
                  삭제
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
  );
};

export default TutorsPage;
