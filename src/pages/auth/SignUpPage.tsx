import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import {
  fetchOrganizations,
  fetchTracks,
} from "../../services/admin/organization";
import { Organization } from "../../types/organization";
import { Track } from "../../types/track";
import { Batch } from "../../types/batch";
import Button from "../../components/shared/Button";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // 기본값: 수강생
    organizationId: "",
    trackId: "",
    batchId: "",
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchOrganizations().then(setOrganizations);
  }, []);

  useEffect(() => {
    if (!form.organizationId) {
      setTracks([]);
      setBatches([]);
      return;
    }
    fetchTracks(form.organizationId).then(setTracks);
  }, [form.organizationId]);

  useEffect(() => {
    const selected = tracks.find((t) => t.id === form.trackId);
    setBatches(selected ? selected.batches : []);
  }, [form.trackId, tracks]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: form.name,
        email: form.email,
        role: form.role,
        organizationId: form.organizationId,
        trackId: form.trackId,
        batchId: form.batchId,
        status: form.role === "tutor" ? "pending" : "active",
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='p-10 text-center space-y-6 bg-white rounded-xl shadow max-w-md w-full'>
        <h1 className='text-xl font-bold text-center mb-6'>회원가입</h1>
        {error && (
          <p className='text-red-500 text-sm mb-3 text-center'>{error}</p>
        )}
        {success ? (
          <div className='text-center text-green-600'>
            회원가입 성공! 로그인 후 이용이 가능합니다.
            <Button className='mt-4' onClick={() => navigate("/login")}>
              로그인 페이지로 이동
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
            <input
              type='text'
              name='name'
              placeholder='이름'
              className='border px-3 py-2 rounded'
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type='email'
              name='email'
              placeholder='이메일'
              className='border px-3 py-2 rounded'
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type='password'
              name='password'
              placeholder='비밀번호'
              className='border px-3 py-2 rounded'
              value={form.password}
              onChange={handleChange}
              required
            />

            <select
              name='role'
              value={form.role}
              onChange={handleChange}
              className='border px-3 py-2 rounded'
            >
              <option value='student'>수강생</option>
              <option value='tutor'>튜터</option>
            </select>

            <select
              name='organizationId'
              value={form.organizationId}
              onChange={handleChange}
              className='border px-3 py-2 rounded'
              required
            >
              <option value=''>조직 선택</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>

            <select
              name='trackId'
              value={form.trackId}
              onChange={handleChange}
              className='border px-3 py-2 rounded'
              required
            >
              <option value=''>트랙 선택</option>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.name}
                </option>
              ))}
            </select>

            <select
              name='batchId'
              value={form.batchId}
              onChange={handleChange}
              className='border px-3 py-2 rounded'
              required
            >
              <option value=''>기수 선택</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>

            <Button type='submit' variant='primary' disabled={loading}>
              {loading ? "가입 중..." : "회원가입"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
