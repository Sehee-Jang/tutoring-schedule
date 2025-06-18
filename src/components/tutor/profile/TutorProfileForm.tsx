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
    <div className='space-y-8 max-w-xl mx-auto'>
      <h2 className='text-xl font-semibold text-gray-900'>프로필 수정</h2>

      {/* 이름 */}
      <div className='space-y-1'>
        <label className='text-sm text-gray-500'>이름</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full px-0 py-2 border-b border-gray-300 focus:outline-none focus:border-black transition'
          placeholder='이름을 입력하세요'
        />
      </div>

      {/* 소개 */}
      {/* <div className='space-y-1'>
        <label className='text-sm text-gray-500'>소개</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='w-full px-0 py-2 border-b border-gray-300 h-28 resize-none focus:outline-none focus:border-black transition'
          placeholder='간단한 소개를 입력하세요'
        />
      </div> */}

      {/* 소속 정보 */}
      <div className='space-y-4'>
        <div>
          <span className='text-sm text-gray-500'>소속 조직</span>
          <p className='text-base text-gray-900 font-medium'>
            {organizationName || (
              <span className='text-gray-400'>불러오는 중...</span>
            )}
          </p>
        </div>

        <div>
          <span className='text-sm text-gray-500'>트랙</span>
          <p className='text-base text-gray-900 font-medium'>
            {trackName || <span className='text-gray-400'>불러오는 중...</span>}
          </p>
        </div>

        <div>
          <span className='text-sm text-gray-500'>담당 기수</span>
          <div className='flex flex-wrap gap-2 mt-1'>
            {batches.map((batch) => {
              const isSelected = selectedBatchIds.includes(batch.id);
              return (
                <Button
                  variant='round'
                  key={batch.id}
                  size='sm'
                  onClick={() => handleToggleBatch(batch.id)}
                  className={`
              ${
                isSelected
                  ? "bg-black text-white border-blue"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
                >
                  {batch.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 저장 */}
      <div className='pt-6'>
        <Button
          onClick={handleSubmit}
          className='w-full rounded-lg text-sm font-mediu'
        >
          저장하기
        </Button>
      </div>
    </div>
  );
};

export default TutorProfileForm;
