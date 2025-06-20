import { useState } from "react";
import { useOrganizations } from "../../../hooks/useOrganizations";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { useToast } from "../../../hooks/use-toast";

interface Props {
  tutorId: string;
  currentOrgId?: string;
}

const OrganizationDropdown: React.FC<Props> = ({ tutorId, currentOrgId }) => {
  const { organizations } = useOrganizations();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(currentOrgId || "");
  const { toast } = useToast();

  const handleSelect = async (id: string) => {
    try {
      setSelectedId(id);
      await updateDoc(doc(db, "users", tutorId), {
        organizationId: id,
        trackId: null,
        batchIds: [],
      });
      toast({ title: "조직이 업데이트되었고 관련 정보가 초기화되었습니다." });
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({ title: "조직 업데이트 실패", variant: "destructive" });
    }
  };

  const selectedName =
    organizations.find((o) => o.id === selectedId)?.name || "조직 선택";

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
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => handleSelect(org.id)}
              className={`block w-full px-3 py-1 text-sm text-left hover:bg-gray-100 ${
                org.id === selectedId ? "bg-blue-100 font-semibold" : ""
              }`}
            >
              {org.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationDropdown;
