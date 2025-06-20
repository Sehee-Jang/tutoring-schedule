import React, { useEffect, useState } from "react";
import ModalLayout from "../../shared/ModalLayout";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../services/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../shared/Button";
import { useTracks } from "../../../hooks/useTracks";
import { Batch } from "../../../types/batch";
import { isSuperAdmin } from "../../../utils/roleUtils";
import {
  getVisibleFieldsForRole,
  ROLE_LABEL,
} from "../../../utils/getVisibleFieldsForRole";
import { getAllowedRolesByUserRole } from "../../../utils/getAllowedRolesByUserRole";
import { UserRole } from "../../../types/user";

interface ManagerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManagerFormModal: React.FC<ManagerFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | "">("");
  const [organizations, setOrganizations] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [selectedTrackId, setSelectedTrackId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const { tracks } = useTracks(selectedOrgId);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const availableRoles = getAllowedRolesByUserRole(user?.role);
  const {
    showOrgSelect,
    showTrackSelect,
    showBatchSelect,
    showRoleSelect,
    allowedRoles,
  } = getVisibleFieldsForRole(user?.role, role as UserRole);

  useEffect(() => {
    if (isSuperAdmin(user?.role)) {
      const fetchOrganizations = async () => {
        const snapshot = await getDocs(collection(db, "organizations"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "",
        }));
        setOrganizations(list);
      };
      fetchOrganizations();
    } else {
      setSelectedOrgId(user?.organizationId || "");
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "track_admin") {
      setRole("batch_admin");
      setSelectedOrgId(user.organizationId || "");
      setSelectedTrackId(user.trackId || "");
    }
  }, [user]);

  useEffect(() => {
    if (!role) return;

    if (role === "organization_admin") {
      isSuperAdmin(user?.role) && setSelectedOrgId("");
      setSelectedTrackId("");
      setSelectedBatchId("");
    }

    if (role === "track_admin") {
      if (!selectedOrgId && user?.organizationId) {
        setSelectedOrgId(user.organizationId);
      }
      setSelectedTrackId("");
      setSelectedBatchId("");
    }

    if (role === "batch_admin") {
      if (!selectedOrgId && user?.organizationId) {
        setSelectedOrgId(user.organizationId);
      }
      if (!selectedTrackId && user?.trackId) {
        setSelectedTrackId(user.trackId);
      }
      setSelectedBatchId("");
    }
  }, [role]);

  useEffect(() => {
    if (
      selectedOrgId &&
      selectedTrackId &&
      (role === "batch_admin" || user?.role === "track_admin")
    ) {
      const fetchBatches = async () => {
        const snapshot = await getDocs(
          collection(
            db,
            "organizations",
            selectedOrgId,
            "tracks",
            selectedTrackId,
            "batches"
          )
        );

        const batchList: Batch[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "",
          startDate: doc.data().startDate || "",
          endDate: doc.data().endDate || "",
          createdAt: doc.data().created_at?.toDate?.() ?? new Date(),
          updatedAt: doc.data().updated_at?.toDate?.() ?? new Date(),
        }));

        setBatches(batchList);
      };

      fetchBatches();
    } else {
      setBatches([]);
    }
  }, [selectedTrackId, selectedOrgId, role, user?.role]);

  const handleCreate = async () => {
    if (!name || !email || !password || !role) return;

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const userData: any = {
      name,
      email,
      role,
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    userData.organizationId = selectedOrgId;
    if (role === "track_admin" || role === "batch_admin") {
      userData.trackId = selectedTrackId;
    }
    if (role === "batch_admin") {
      userData.batchId = selectedBatchId;
    }

    await setDoc(doc(db, "users", uid), userData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalLayout onClose={onClose}>
      <div className='space-y-6 p-6'>
        <h2 className='text-xl font-semibold'>관리자 등록</h2>


        {/* 역할 선택 */}
        {showRoleSelect ? (
          <div className='space-y-1'>
            <label className='text-sm font-medium text-gray-700'>
              관리자 역할
            </label>
            <select
              className='w-full border rounded-md px-3 py-2 text-sm'
              value={role}
              onChange={(e) => {
                setRole(e.target.value as UserRole);
                setSelectedTrackId("");
                setSelectedBatchId("");
              }}
            >
              <option value=''>선택</option>
              {allowedRoles.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
          </div>
        ) : (
          user?.role === "track_admin" && (
            <div className='space-y-1'>
              <label className='text-sm font-medium text-gray-700'>
                관리자 역할
              </label>
              <p className='text-sm px-3 py-2 border rounded-md bg-gray-100 text-gray-600'>
                {ROLE_LABEL["batch_admin"]}
              </p>
            </div>
          )
        )}

        {/* 조직 선택 */}
        {showOrgSelect && (
          <div className='space-y-1'>
            <label className='text-sm font-medium'>소속 조직</label>
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className='w-full border rounded px-3 py-2 text-sm'
              disabled={user?.role !== "super_admin"}
            >
              <option value=''>선택</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 트랙 선택 */}
        {showTrackSelect && (
          <div className='space-y-1'>
            <label className='text-sm font-medium'>소속 트랙</label>
            <select
              value={selectedTrackId}
              onChange={(e) => setSelectedTrackId(e.target.value)}
              className='w-full border rounded px-3 py-2 text-sm'
              disabled={!selectedOrgId}
            >
              <option value=''>선택</option>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 기수 선택 */}
        {showBatchSelect && (
          <div className='space-y-1'>
            <label className='text-sm font-medium'>담당 기수</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className='w-full border rounded px-3 py-2 text-sm'
              disabled={!selectedTrackId}
            >
              <option value=''>선택</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 기본 정보 입력 */}
        <div className='space-y-1'>
          <label className='text-sm font-medium'>이름</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full border rounded px-3 py-2 text-sm'
            placeholder='이름을 입력하세요'
          />
        </div>
        <div className='space-y-1'>
          <label className='text-sm font-medium'>이메일</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full border rounded px-3 py-2 text-sm'
            placeholder='이메일을 입력하세요'
          />
        </div>
        <div className='space-y-1'>
          <label className='text-sm font-medium'>비밀번호</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full border rounded px-3 py-2 text-sm'
            placeholder='비밀번호를 입력하세요'
          />
        </div>

        <div className='pt-2'>
          <Button
            variant='primary'
            onClick={handleCreate}
            disabled={!role || !name || !email || !password}
            className='w-full'
          >
            관리자 등록
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ManagerFormModal;
