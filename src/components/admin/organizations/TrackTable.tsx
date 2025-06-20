import React, { useState, useEffect } from "react";
import {
  fetchTracks,
  createTrack,
  updateTrack,
  deleteTrack,
} from "../../../services/admin/organization";
import { Track } from "../../../types/track";
import Button from "../../../components/shared/Button";
import TrackFormModal from "./TrackFormModal";
import { useToast } from "../../../hooks/use-toast";
import { DeleteAlertDialog } from "../../../components/shared/DeleteAlertDialog";

interface TrackTableProps {
  organizationId: string;
  selectedTrackId: string | null;
  onSelectTrack: (trackId: string) => void;
  autoSelectFirstTrack?: boolean;
}

const TrackTable: React.FC<TrackTableProps> = ({
  organizationId,
  selectedTrackId,
  onSelectTrack,
  autoSelectFirstTrack = true,
}) => {
  const { toast } = useToast();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  useEffect(() => {
    const loadTracksAndMaybeSelect = async () => {
      const trackList = await fetchTracks(organizationId);
      setTracks(trackList);

      const shouldAutoSelect =
        autoSelectFirstTrack && trackList.length > 0 && !selectedTrackId;
      if (shouldAutoSelect) {
        onSelectTrack(trackList[0].id);
      }
    };

    loadTracksAndMaybeSelect();
  }, [organizationId]);

  const loadTracks = async () => {
    const trackList = await fetchTracks(organizationId);
    setTracks(trackList);
  };

  const handleCreate = () => {
    setModalMode("create");
    setSelectedTrack(null);
    setIsModalOpen(true);
  };

  const handleEdit = (track: Track) => {
    setModalMode("edit");
    setSelectedTrack(track);
    setIsModalOpen(true);
  };

  const handleDelete = async (trackId: string) => {
    try {
      await deleteTrack(organizationId, trackId);
      toast({ title: "트랙 삭제 완료" });
      loadTracks();
    } catch (err) {
      console.error("트랙 삭제 오류:", err);
      toast({ title: "❌ 트랙 삭제 실패", variant: "destructive" });
    }
  };

  const handleSubmit = async (name: string) => {
    try {
      if (modalMode === "create") {
        await createTrack(organizationId, name);
        toast({ title: "트랙 생성 완료" });
      } else if (modalMode === "edit" && selectedTrack) {
        await updateTrack(organizationId, selectedTrack.id, name);
        toast({ title: "트랙 수정 완료" });
      }
      setIsModalOpen(false);
      loadTracks();
    } catch (err) {
      console.error("트랙 추가/수정 오류:", err);
      toast({ title: "❌ 작업 실패", variant: "destructive" });
    }
  };

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>트랙 목록</h2>

      <ul className='space-y-2'>
        {tracks.map((track) => (
          <li
            key={track.id}
            className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
              selectedTrackId === track.id
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
            onClick={() => onSelectTrack(track.id)}
          >
            {/* 수정 삭제 버튼 */}
            <div className='flex justify-between items-center'>
              <span>{track.name}</span>
              <div className='space-x-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 클릭 방지
                    handleEdit(track);
                  }}
                >
                  수정
                </Button>
                <DeleteAlertDialog
                  onConfirm={async () => {
                    handleDelete(track.id);
                  }}
                  triggerLabel='삭제'
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Button variant='outline' onClick={handleCreate} className='mt-4'>
        트랙 추가
      </Button>

      <TrackFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialName={selectedTrack?.name}
        mode={modalMode}
      />
    </div>
  );
};

export default TrackTable;
