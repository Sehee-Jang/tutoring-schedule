import React, { useState, useEffect } from "react";
import {
  fetchOrganizations,
  fetchTracks,
  fetchBatches,
  createOrganization,
  createTrack,
  createBatch,
} from "../../../services/admin/organization";
import { useToast } from "../../../hooks/use-toast";
import Button from "../../../components/shared/Button";

interface Organization {
  id: string;
  name: string;
}

interface Track {
  id: string;
  name: string;
}

interface Batch {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

const OrganizationManager = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [newOrganization, setNewOrganization] = useState("");
  const [newTrack, setNewTrack] = useState("");
  const [newBatch, setNewBatch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    const orgList = await fetchOrganizations();
    setOrganizations(orgList);
  };

  const loadTracks = async (organizationId: string) => {
    const trackList = await fetchTracks(organizationId);
    setTracks(trackList);
    setSelectedOrg(organizationId);
    setBatches([]); // 기수 초기화
    setSelectedTrack(null);
  };

  const loadBatches = async (organizationId: string, trackId: string) => {
    const batchList = await fetchBatches(organizationId, trackId);
    setBatches(batchList);
    setSelectedTrack(trackId);
  };

  const handleCreateOrganization = async () => {
    if (!newOrganization.trim()) return;
    await createOrganization(newOrganization);
    toast({ title: "✅ 조직 생성 완료" });
    setNewOrganization("");
    loadOrganizations();
  };

  const handleCreateTrack = async () => {
    if (!newTrack.trim() || !selectedOrg) return;
    await createTrack(selectedOrg, newTrack);
    toast({ title: "✅ 트랙 생성 완료" });
    setNewTrack("");
    loadTracks(selectedOrg);
  };

  const handleCreateBatch = async () => {
    if (!newBatch.trim() || !selectedOrg || !selectedTrack) return;
    await createBatch(
      selectedOrg,
      selectedTrack,
      newBatch,
      "2025-01-01",
      "2025-12-31"
    );
    toast({ title: "✅ 기수 생성 완료" });
    setNewBatch("");
    loadBatches(selectedOrg, selectedTrack);
  };

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>조직 관리</h1>

      {/* 조직 생성 */}
      <div className='mb-4'>
        <input
          type='text'
          placeholder='새 조직 이름'
          value={newOrganization}
          onChange={(e) => setNewOrganization(e.target.value)}
          className='border p-2 rounded mr-2'
        />
        <Button variant='primary' onClick={handleCreateOrganization}>
          조직 생성
        </Button>
      </div>

      {/* 조직 목록 */}
      <h2 className='text-xl font-semibold mb-2'>조직 목록</h2>
      {organizations.map((org) => (
        <div key={org.id} className='mb-2'>
          <span>{org.name}</span>

          <button
            onClick={() => loadTracks(org.id)}
            className='ml-2 text-blue-500 underline'
          >
            트랙 보기
          </button>
        </div>
      ))}

      {/* 트랙 목록 */}
      {selectedOrg && (
        <div className='mt-6'>
          <h2 className='text-xl font-semibold mb-2'>트랙 목록</h2>
          <input
            type='text'
            placeholder='새 트랙 이름'
            value={newTrack}
            onChange={(e) => setNewTrack(e.target.value)}
            className='border p-2 rounded mr-2'
          />
          <Button variant='primary' onClick={handleCreateTrack}>
            트랙 생성
          </Button>

          {tracks.map((track) => (
            <div key={track.id} className='ml-4'>
              <span>{track.name}</span>
              <button
                onClick={() => loadBatches(selectedOrg, track.id)}
                className='ml-2 text-blue-500 underline'
              >
                기수 보기
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 기수 목록 */}
      {selectedTrack && (
        <div className='mt-6'>
          <h2 className='text-xl font-semibold mb-2'>기수 목록</h2>
          <input
            type='text'
            placeholder='새 기수 이름'
            value={newBatch}
            onChange={(e) => setNewBatch(e.target.value)}
            className='border p-2 rounded mr-2'
          />
          <Button variant='primary' onClick={handleCreateBatch}>
            기수 생성
          </Button>

          {batches.map((batch) => (
            <div key={batch.id} className='ml-4'>
              <span>{batch.name} (2025-01-01 ~ 2025-12-31)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationManager;
