import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import {
  fetchOrganizations,
  fetchTracks,
} from "../../services/admin/organization";
import { Organization } from "../../types/organization";
import { Track } from "../../types/track";
import { Batch } from "../../types/batch";
import Button from "../../components/shared/Button";
import { toast } from "../../hooks/use-toast";

const CompleteProfilePage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [form, setForm] = useState({
    role: "",
    organizationId: "",
    trackId: "",
    batchId: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (isLoading || !user) return;

      if (user.role === "super_admin" || user.organizationId) {
        navigate("/"); // 이미 정보가 있으면 홈으로
        return;
      }

      const orgs = await fetchOrganizations();
      setOrganizations(orgs);
      setLoading(false);
    };

    init();
  }, [user, isLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "organizationId") {
      fetchTracks(value).then((trackList) => {
        setTracks(trackList);
        setForm((prev) => ({ ...prev, trackId: "", batchId: "" }));
        setBatches([]);
      });
    }

    if (name === "trackId") {
      const selectedTrack = tracks.find((t) => t.id === value);
      setBatches(selectedTrack?.batches || []);
      setForm((prev) => ({ ...prev, batchId: "" }));
    }
  };

  const uid = auth.currentUser?.uid;
  if (!uid || loading) {
    return (
      <div className='flex justify-center items-center min-h-[50vh] text-gray-500'>
        조직 정보를 불러오는 중...
      </div>
    );
  }

  const userRef = doc(db, "users", uid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { role, organizationId, trackId, batchId } = form;
    if (!role || !organizationId || !trackId || !batchId) {
      toast({ title: "❌ 모든 항목을 선택해주세요.", variant: "destructive" });
      return;
    }

    try {
      const updatePayload: any = {
        role,
        organizationId,
        trackId,
        batchId,
        status: role === "tutor" ? "pending" : "active",
        updatedAt: serverTimestamp(),
      };

      // 튜터는 승인 대기 상태로 설정
      if (user?.role === "tutor") {
        updatePayload.status = "pending";
      }

      await updateDoc(userRef, updatePayload);

      if (form.role === "tutor") {
        toast({
          title: "정보가 저장되었습니다.",
          description: "관리자의 승인을 기다려주세요.",
        });
        navigate("/pending-approval");
      } else {
        toast({ title: "정보가 저장되었습니다." });
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "❌ 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className=' p-10 space-y-6 bg-white rounded-xl shadow max-w-md w-full '>
        <h2 className='text-xl font-bold mb-4 text-center'>
          조직 정보를 입력해주세요
        </h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* 역할 선택 */}
          <div>
            <label className='text-sm text-gray-600'>역할</label>
            <select
              name='role'
              value={form.role}
              onChange={handleChange}
              className='w-full border px-3 py-2 rounded'
            >
              <option value=''>역할 선택</option>
              <option value='student'>수강생</option>
              <option value='tutor'>튜터</option>
            </select>
          </div>

          {/* 조직 선택 */}
          <div>
            <label className='text-sm text-gray-600'>조직</label>
            <select
              name='organizationId'
              value={form.organizationId}
              onChange={handleChange}
              className='w-full border px-3 py-2 rounded'
            >
              <option value=''>조직 선택</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          {/* 트랙 선택 */}
          <div>
            <label className='text-sm text-gray-600'>트랙</label>
            <select
              name='trackId'
              value={form.trackId}
              onChange={handleChange}
              className='w-full border px-3 py-2 rounded'
            >
              <option value=''>트랙 선택</option>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.name}
                </option>
              ))}
            </select>
          </div>

          {/* 기수 선택 */}
          <div>
            <label className='text-sm text-gray-600'>기수</label>
            <select
              name='batchId'
              value={form.batchId}
              onChange={handleChange}
              className='w-full border px-3 py-2 rounded'
            >
              <option value=''>기수 선택</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name} ({batch.startDate} ~ {batch.endDate})
                </option>
              ))}
            </select>
          </div>

          <Button type='submit'>저장하기</Button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
