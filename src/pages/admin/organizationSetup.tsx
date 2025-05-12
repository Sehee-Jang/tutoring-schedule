import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useToast } from "../../hooks/use-toast";

interface Organization {
  id: string;
  name: string;
  tracks?: Track[];
}

interface Track {
  id: string;
  name: string;
  batches: string[];
}

const AdminOrganizationSetup = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [newOrganization, setNewOrganization] = useState("");
  const [newTrack, setNewTrack] = useState("");
  const [newBatch, setNewBatch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // 조직 목록 불러오기
  const fetchOrganizations = async () => {
    const snapshot = await getDocs(collection(db, "organizations"));
    const orgList = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setOrganizations(orgList);
  };

  // 새로운 조직 생성
  const createOrganization = async () => {
    if (!newOrganization.trim()) return;
    await addDoc(collection(db, "organizations"), {
      name: newOrganization,
    });
    toast({ title: "✅ 조직 생성 완료" });
    setNewOrganization("");
    fetchOrganizations();
  };

  // 트랙 및 기수 생성 (Firestore의 서브컬렉션 사용)
  const createTrackWithBatches = async (organizationId: string) => {
    if (!newTrack.trim() || !newBatch.trim()) return;

    const trackRef = await addDoc(
      collection(db, `organizations/${organizationId}/tracks`),
      {
        name: newTrack,
        batches: [newBatch], // 초기 기수 배열로 저장
      }
    );

    toast({ title: "✅ 트랙 및 기수 생성 완료" });
    setNewTrack("");
    setNewBatch("");
    fetchOrganizations();
  };

  // 기수 추가 (기존 트랙에 추가)
  const addBatchToTrack = async (organizationId: string, trackId: string) => {
    if (!newBatch.trim()) return;

    const trackRef = doc(db, `organizations/${organizationId}/tracks`, trackId);
    const trackSnapshot = await getDocs(collection(trackRef, "batches"));

    const existingBatches = trackSnapshot.docs.map((doc) => doc.data().batch);
    const updatedBatches = [...new Set([...existingBatches, newBatch])]; // 중복 방지

    await updateDoc(trackRef, {
      batches: updatedBatches,
    });

    toast({ title: "✅ 기수 추가 완료" });
    setNewBatch("");
    fetchOrganizations();
  };

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>조직, 트랙, 기수 관리</h1>

      {/* 조직 생성 */}
      <div className='mb-4'>
        <input
          type='text'
          placeholder='새 조직 이름'
          value={newOrganization}
          onChange={(e) => setNewOrganization(e.target.value)}
          className='border p-2 rounded mr-2'
        />
        <button
          onClick={createOrganization}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          조직 생성
        </button>
      </div>

      {/* 트랙 및 기수 생성 */}
      <div>
        {organizations.map((org) => (
          <div key={org.id} className='mb-6'>
            <h2 className='font-semibold'>{org.name}</h2>

            <input
              type='text'
              placeholder='트랙 이름 (예: UXUI)'
              value={newTrack}
              onChange={(e) => setNewTrack(e.target.value)}
              className='border p-2 rounded mr-2'
            />
            <input
              type='text'
              placeholder='초기 기수 (예: 6기)'
              value={newBatch}
              onChange={(e) => setNewBatch(e.target.value)}
              className='border p-2 rounded mr-2'
            />
            <button
              onClick={() => createTrackWithBatches(org.id)}
              className='bg-green-500 text-white px-4 py-2 rounded'
            >
              트랙 생성
            </button>

            {/* 생성된 트랙 및 기수 표시 */}
            <div className='mt-4'>
              {org.tracks?.map((track) => (
                <div key={track.id} className='mb-2'>
                  <h3 className='font-semibold'>{track.name}</h3>
                  <div className='flex flex-wrap gap-2'>
                    {track.batches?.map((batch) => (
                      <span
                        key={batch}
                        className='bg-gray-200 px-2 py-1 rounded text-sm'
                      >
                        {batch}
                      </span>
                    ))}
                  </div>
                  <input
                    type='text'
                    placeholder='기수 추가 (예: 7기)'
                    value={newBatch}
                    onChange={(e) => setNewBatch(e.target.value)}
                    className='border p-2 rounded mt-2 mr-2'
                  />
                  <button
                    onClick={() => addBatchToTrack(org.id, track.id)}
                    className='bg-blue-500 text-white px-3 py-1 rounded'
                  >
                    기수 추가
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrganizationSetup;
