import { useState } from "react";
import { auth, db } from "@/services/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import { serverTimestamp } from "firebase/firestore";

const SignUpForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "tutor", // 기본값: 튜터
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      // 이메일 인증 메일 보내기
      await sendEmailVerification(user);

      // Firestore에 사용자 문서 저장
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
        role: form.role,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("회원가입 성공! 이메일 인증 후 로그인해주세요.");
      router.push("/"); // 메인 또는 로그인 페이지로 이동
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
    <div className='max-w-sm mx-auto bg-white shadow rounded p-6 mt-6'>
      <h2 className='text-lg font-bold text-gray-800 mb-4'>회원가입</h2>
      {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}
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
          <option value='tutor'>튜터</option>
          <option value='student'>수강생</option>
        </select>
        <Button type='submit' variant='primary' disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
