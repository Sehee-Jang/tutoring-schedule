import { useState, useEffect } from "react";
import { createAdminAccount } from "../../services/adminSetup";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  fetchOrganizations,
  fetchTracks,
  fetchBatches,
} from "../../services/admin/organization";
import { Organization } from "../../types/organization";
import { Track } from "../../types/track";
import { Batch } from "../../types/batch";

const CreateAdminPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);


  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizations().then(setOrganizations);
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      fetchTracks(selectedOrg).then(setTracks);
    } else {
      setTracks([]);
    }
    setSelectedTrack("");
    setSelectedBatch("");
  }, [selectedOrg]);

  useEffect(() => {
    if (selectedOrg && selectedTrack) {
      fetchBatches(selectedOrg, selectedTrack).then(setBatches);
    } else {
      setBatches([]);
    }
    setSelectedBatch("");
  }, [selectedTrack, selectedOrg]);

  const handleCreateAdmin = async () => {
    if (
      (role === "organization_admin" && !selectedOrg) ||
      (role === "track_admin" && (!selectedOrg || !selectedTrack)) ||
      (role === "batch_admin" &&
        (!selectedOrg || !selectedTrack || !selectedBatch))
    ) {
      toast({ title: "❌ 필수 항목을 선택해주세요.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await createAdminAccount(
        email,
        password,
        role,
        selectedOrg,
        selectedTrack,
        selectedBatch
      );
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

      {/* 이메일 & 비밀번호 */}
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

      {/* 역할 선택 */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className='mb-4 w-full p-2 border rounded'
      >
        <option value='organization_admin'>조직 관리자</option>
        <option value='track_admin'>트랙 관리자</option>
        <option value='batch_admin'>기수 관리자</option>
      </select>

      {/* 조직 ID (트랙/기수 관리자도 필요) */}
      {/* 조직 선택 */}
      {(role === "organization_admin" ||
        role === "track_admin" ||
        role === "batch_admin") && (
        <select
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
          className='mb-4 w-full p-2 border rounded'
        >
          <option value=''>조직 선택</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      )}

      {/* 트랙 선택 */}
      {(role === "track_admin" || role === "batch_admin") && (
        <select
          value={selectedTrack}
          onChange={(e) => setSelectedTrack(e.target.value)}
          className='mb-4 w-full p-2 border rounded'
        >
          <option value=''>트랙 선택</option>
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.name}
            </option>
          ))}
        </select>
      )}

      {/* 기수 선택 */}
      {role === "batch_admin" && (
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className='mb-4 w-full p-2 border rounded'
        >
          <option value=''>기수 선택</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </select>
      )}

      {/* 생성 버튼 */}
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
