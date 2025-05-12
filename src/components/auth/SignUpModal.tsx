"use client";

import { useState } from "react";
import { auth, db } from "../../services/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import ModalLayout from "../../components/shared/ModalLayout";
import { useModal } from "../../context/ModalContext";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal = ({ isOpen }: SignUpModalProps) => {
  const { closeModal } = useModal();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "tutor",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

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
          <input
            type='text'
            name='name'
            placeholder='이름'
            className='border border-gray-300 px-3 py-2 rounded text-gray-700'
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type='email'
            name='email'
            placeholder='이메일'
            className='border border-gray-300 px-3 py-2 rounded'
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type='password'
            name='password'
            placeholder='비밀번호'
            className='border border-gray-300 px-3 py-2 rounded'
            value={form.password}
            onChange={handleChange}
            required
          />
          <select
            name='role'
            value={form.role}
            onChange={handleChange}
            className='border border-gray-300 px-3 py-2 rounded text-gray-700'
          >
            <option value='tutor'>튜터</option>
            <option value='student'>수강생</option>
          </select>
          <button
            type='submit'
            className='bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
            disabled={loading}
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>
      )}
    </ModalLayout>
  );
};

export default SignUpModal;

// "use client";

// import { useState } from "react";
// import { auth, db } from "../../services/firebase";
// import {
//   createUserWithEmailAndPassword,
//   sendEmailVerification,
// } from "firebase/auth";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import ModalLayout from "../shared/ModalLayout";
// import { useModal } from "../../context/ModalContext";

// const SignUpModal = () => {
//   const { modalType, closeModal } = useModal();
//   const isOpen = modalType === "signup";

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "tutor",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   if (!isOpen) return null;

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess(false);

//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         form.email,
//         form.password
//       );
//       const user = userCredential.user;

//       await sendEmailVerification(user);

//       await setDoc(doc(db, "users", user.uid), {
//         name: form.name,
//         email: form.email,
//         role: form.role,
//         status: "pending",
//         createdAt: serverTimestamp(),
//       });

//       setSuccess(true);
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message || "회원가입 중 오류가 발생했습니다.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ModalLayout onClose={closeModal}>
//       <h2 className='text-xl font-bold mb-4 text-center'>회원가입</h2>
//       {error && (
//         <p className='text-red-500 text-sm mb-3 text-center'>{error}</p>
//       )}
//       {success ? (
//         <p className='text-green-600 text-sm text-center'>
//           회원가입 성공! 이메일 인증 후 로그인해주세요.
//         </p>
//       ) : (
//         <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
//           <input
//             type='text'
//             name='name'
//             placeholder='이름'
//             className='border px-3 py-2 rounded'
//             value={form.name}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type='email'
//             name='email'
//             placeholder='이메일'
//             className='border px-3 py-2 rounded'
//             value={form.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type='password'
//             name='password'
//             placeholder='비밀번호'
//             className='border px-3 py-2 rounded'
//             value={form.password}
//             onChange={handleChange}
//             required
//           />
//           <select
//             name='role'
//             value={form.role}
//             onChange={handleChange}
//             className='border px-3 py-2 rounded'
//           >
//             <option value='tutor'>튜터</option>
//             <option value='student'>수강생</option>
//           </select>
//           <button
//             type='submit'
//             className='bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
//             disabled={loading}
//           >
//             {loading ? "가입 중..." : "회원가입"}
//           </button>
//         </form>
//       )}
//     </ModalLayout>
//   );
// };

// export default SignUpModal;
