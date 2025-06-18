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
import {
  isOrganizationAdminOrHigher,
  isSuperAdmin,
  isTrackAdminOrHigher,
} from "../../../utils/roleUtils";

interface ManagerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManagerFormModal: React.FC<ManagerFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  // const isSuperAdmin = user?.role === "super_admin";
  const isTrackAdmin = user?.role === "track_admin";

  const [role, setRole] = useState("");
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
  console.log("batches", batches);
  // 조직 목록 불러오기 (슈퍼관리자만)
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

  // 트랙 선택 시 해당 트랙의 기수 불러오기 (배치)
  useEffect(() => {
    const fetchBatches = async () => {
      if (!selectedOrgId || !selectedTrackId || role !== "batch_admin") {
        setBatches([]);
        return;
      }

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
  }, [selectedTrackId, selectedOrgId, role]);

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
      <div className='space-y-4'>
        {/* <select
          className='input'
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setSelectedTrackId("");
            setSelectedBatchId("");
          }}
        >
          <option value=''>관리자 역할 선택</option>
          <option value='organization_admin'>조직 관리자</option>
          <option value='track_admin'>트랙 관리자</option>
          <option value='batch_admin'>기수 관리자</option>
        </select> */}

        {/* 관리자 유형 선택 (슈퍼관리자만) */}
        {isSuperAdmin(user?.role) && (
          <select
            className='input'
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setSelectedTrackId("");
              setSelectedBatchId("");
            }}
          >
            <option value=''>관리자 역할 선택</option>
            <option value='organization_admin'>조직 관리자</option>
            <option value='track_admin'>트랙 관리자</option>
            <option value='batch_admin'>기수 관리자</option>
          </select>
        )}

        {/* 관리자 유형 선택 (조직관리자 이상) */}
        {isOrganizationAdminOrHigher(user?.role) && (
          <select
            className='input'
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setSelectedTrackId("");
              setSelectedBatchId("");
            }}
          >
            <option value=''>관리자 역할 선택</option>
            <option value='track_admin'>트랙 관리자</option>
            <option value='batch_admin'>기수 관리자</option>
          </select>
        )}

        {/* 관리자 유형 선택 (트랙관리자 이상) */}
        {isSuperAdmin(user?.role) && (
          <select
            className='input'
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setSelectedTrackId("");
              setSelectedBatchId("");
            }}
          >
            <option value=''>관리자 역할 선택</option>
            <option value='batch_admin'>기수 관리자</option>
          </select>
        )}

        {/* 조직 선택 (슈퍼관리자만) */}
        {isSuperAdmin(user?.role) && (
          <select
            className='input'
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
          >
            <option value=''>조직 선택</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        )}

        {/* 트랙 선택 (슈퍼, 조직 관리자만) */}
        {(role === "track_admin" || role === "batch_admin") &&
          isOrganizationAdminOrHigher(user?.role) && (
            <select
              className='input'
              value={selectedTrackId}
              onChange={(e) => setSelectedTrackId(e.target.value)}
              disabled={!selectedOrgId}
            >
              <option value=''>트랙 선택</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}

        {/* 기수 선택 (슈퍼, 조직, 트랙 관리자) */}
        {role === "batch_admin" && isTrackAdminOrHigher(user?.role) && (
          <select
            className='input'
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            disabled={!selectedTrackId}
          >
            <option value=''>기수 선택</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}

        <input
          className='input'
          placeholder='이름'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className='input'
          placeholder='이메일'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='input'
          placeholder='비밀번호'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button variant='primary' onClick={handleCreate} disabled={!role}>
          관리자 등록
        </Button>
      </div>
    </ModalLayout>
  );
};

export default ManagerFormModal;
