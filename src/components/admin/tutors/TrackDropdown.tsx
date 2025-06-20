import { useState } from "react";
import { useTracks } from "../../../hooks/useTracks";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { useToast } from "../../../hooks/use-toast";

interface Props {
  tutorId: string;
  organizationId?: string;
  currentTrackId?: string;
}

const TrackDropdown: React.FC<Props> = ({
  tutorId,
  organizationId,
  currentTrackId,
}) => {
  const { tracks } = useTracks(organizationId || "");
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(currentTrackId || "");
  const { toast } = useToast();

  const handleSelect = async (id: string) => {
    try {
      setSelectedId(id);
      await updateDoc(doc(db, "users", tutorId), {
        trackId: id,
        batchIds: [],
      });

      toast({ title: "트랙이 업데이트되었고 기수가 초기화되었습니다." });
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({ title: "트랙 업데이트 실패", variant: "destructive" });
    }
  };

  const selectedName =
    tracks.find((t) => t.id === selectedId)?.name || "트랙 선택";

  return (
    <div className='relative inline-block text-left'>
      <button
        onClick={() => setOpen(!open)}
        className='px-2 py-0.5 text-xs font-medium rounded-full bg-[#F1F5FF] text-[#1E40AF] border border-[#93C5FD]'
      >
        {selectedName}
      </button>

      {open && (
        <div className='absolute z-10 mt-1 w-40 bg-white border rounded shadow'>
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => handleSelect(track.id)}
              className={`block w-full px-3 py-1 text-sm text-left hover:bg-gray-100 ${
                track.id === selectedId ? "bg-blue-100 font-semibold" : ""
              }`}
            >
              {track.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackDropdown;
