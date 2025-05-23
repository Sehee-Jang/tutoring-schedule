"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../services/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import ModalLayout from "../../components/shared/ModalLayout";
import { useModal } from "../../context/ModalContext";
import {
  fetchOrganizations,
  fetchTracks,
} from "../../services/admin/organization";
import Button from "../shared/Button";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}
interface Organization {
  id: string;
  name: string;
}

interface Track {
  id: string;
  name: string;
  batches: Batch[];
}

interface Batch {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

const SignUpModal = ({ isOpen }: SignUpModalProps) => {
  const { closeModal } = useModal();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "tutor",
    organization: "",
    track: "",
    batch: "",
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, []);

  // 조직 로드
  const loadOrganizations = async () => {
    const orgList = await fetchOrganizations();
    setOrganizations(orgList);
  };

  // 트랙 로드
  const loadTracks = async (organizationId: string) => {
    if (!organizationId) {
      setTracks([]);
      setBatches([]);
      return;
    }

    const trackList = await fetchTracks(organizationId);
    setTracks(trackList);
    setForm((prev) => ({ ...prev, track: "", batch: "" }));
  };

  // 기수 로드 (트랙의 batches에서 바로 사용)
  const loadBatches = (trackId: string) => {
    const selectedTrack = tracks.find((track) => track.id === trackId);
    setBatches(selectedTrack ? selectedTrack.batches : []);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "organization") {
      loadTracks(value);
    }

    if (name === "track") {
      loadBatches(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
        role: form.role,
        organization: form.organization,
        track: form.track,
        batch: form.batch,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message || "회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalLayout onClose={closeModal}>
      <h2 className='text-xl text-gray-700 font-bold mb-4 text-center'>
        회원가입
      </h2>
      {error && (
        <p className='text-red-500 text-sm mb-3 text-center'>{error}</p>
      )}
      {success ? (
        <p className='text-green-600 text-sm text-center'>
          회원가입 성공! 이메일 인증 후 로그인해주세요.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          {/* 이름 */}
          <input
            type='text'
            name='name'
            placeholder='이름'
            className='border border-gray-300 px-3 py-2 rounded text-gray-700'
            value={form.name}
            onChange={handleChange}
            required
          />
          {/* 이메일 */}
          <input
            type='email'
            name='email'
            placeholder='이메일'
            className='border border-gray-300 px-3 py-2 rounded'
            value={form.email}
            onChange={handleChange}
            required
          />
          {/* 비밀번호 */}
          <input
            type='password'
            name='password'
            placeholder='비밀번호'
            className='border border-gray-300 px-3 py-2 rounded'
            value={form.password}
            onChange={handleChange}
            required
          />
          {/* 역할 */}
          <select
            name='role'
            value={form.role}
            onChange={handleChange}
            className='border border-gray-300 px-3 py-2 rounded text-gray-700'
          >
            <option value='tutor'>튜터</option>
            {/* <option value='student'>수강생</option> */}
          </select>
          {/* 조직 */}
          <select
            name='organization'
            value={form.organization}
            onChange={(e) => {
              handleChange(e);
              fetchTracks(e.target.value);
            }}
            className='border border-gray-300 px-3 py-2 rounded text-gray-700'
            required
          >
            <option value=''>조직 선택</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          {/* 트랙 */}
          <select
            name='track'
            value={form.track}
            onChange={handleChange}
            className='border border-gray-300 px-3 py-2 rounded text-gray-700'
            required
          >
            <option value=''>트랙 선택</option>
            {tracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.name}
              </option>
            ))}
          </select>

          {/* 기수 */}
          <select
            name='batch'
            value={form.batch}
            onChange={handleChange}
            className='border border-gray-300 px-3 py-2 rounded text-gray-700'
            required
          >
            <option value=''>기수 선택</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.name}>
                {batch.name} ({batch.startDate} ~ {batch.endDate})
              </option>
            ))}
          </select>
          <Button variant='primary' type='submit' disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </Button>
        </form>
      )}
    </ModalLayout>
  );
};

export default SignUpModal;
