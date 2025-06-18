import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { useAuth } from "../../../context/AuthContext";
import { useBatches } from "../../../hooks/useBatches";
import Button from "../../shared/Button";
import { getNameById } from "../../../utils/getOrgNameById";

type Props = {
  onSuccess: () => void;
};

const TutorProfileForm = ({ onSuccess }: Props) => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [description, setDescription] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [trackName, setTrackName] = useState("");
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>(
    user?.batchIds || []
  );

  const { batches } = useBatches(
    user?.organizationId || "",
    user?.trackId || ""
  );

  useEffect(() => {
    const fetchNames = async () => {
      if (user?.organizationId) {
        const orgName = await getNameById("organizations", user.organizationId);
        setOrganizationName(orgName);
      }

      if (user?.organizationId && user?.trackId) {
        const trackName = await getNameById(
          `organizations/${user.organizationId}/tracks`,
          user.trackId
        );
        setTrackName(trackName);
      }
    };
    fetchNames();
  }, [user?.organizationId, user?.trackId]);

  useEffect(() => {
    console.log("🔍 user.batchIds from AuthContext:", user?.batchIds);
    if (user && user.batchIds) {
      setSelectedBatchIds(user.batchIds);
    }
  }, [user]);

  const handleToggleBatch = (batchId: string) => {
    setSelectedBatchIds((prev) =>
      prev.includes(batchId)
        ? prev.filter((id) => id !== batchId)
        : [...prev, batchId]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    const ref = doc(db, "users", user.id);

    // 1. 사용자 정보 업데이트
    await updateDoc(ref, {
      name,
      description,
      batchIds: selectedBatchIds,
    });

    // 2. Firestore에서 최신 사용자 정보 다시 가져오기
    const updatedSnapshot = await getDoc(ref);
    if (!updatedSnapshot.exists()) return;

    const data = updatedSnapshot.data();

    // 3. AuthContext의 setUser로 업데이트
    setUser({
      id: user.id,
      email: data.email,
      name: data.name,
      role: data.role,
      organizationId: data.organizationId ?? null,
      trackId: data.trackId ?? null,
      batchIds: Array.isArray(data.batchIds) ? data.batchIds : [],
      status: data.status ?? "active",
    });

    onSuccess();
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-gray-800'>프로필 수정</h2>

      {/* 이름 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          이름
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200'
          placeholder='이름을 입력하세요'
        />
      </div>

      {/* 소개 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          소개
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='w-full border border-gray-300 rounded px-3 py-2 h-28 resize-none focus:outline-none focus:ring focus:ring-blue-200'
          placeholder='간단한 소개를 입력하세요'
        />
      </div>

      {/* 담당 조직 및 트랙 */}
      <div className='bg-gray-50 p-4 rounded-lg border mb-4'>
        <p className='text-sm text-gray-600'>
          <strong>소속 조직:</strong> {organizationName || "불러오는 중..."}
          <br />
          <strong>트랙:</strong> {trackName || "불러오는 중..."}
        </p>
      </div>

      {/* 담당 기수 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          담당 기수
        </label>
        <div className='flex flex-wrap gap-3'>
          {batches.map((batch) => (
            <label
              key={batch.id}
              className='flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200 transition'
            >
              <input
                type='checkbox'
                checked={selectedBatchIds.includes(batch.id)}
                onChange={() => handleToggleBatch(batch.id)}
              />
              <span>{batch.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className='pt-4'>
        <Button onClick={handleSubmit} className='w-full'>
          저장하기
        </Button>
      </div>
    </div>
  );
};

export default TutorProfileForm;
