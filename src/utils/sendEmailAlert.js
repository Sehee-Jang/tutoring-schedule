import emailjs from "emailjs-com";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export const sendEmailAlert = async (formData) => {
  const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  try {
    // 1. Firestore tutors 컬렉션 가져오기
    const tutorsSnapshot = await getDocs(collection(db, "tutors"));
    const tutors = {};
    tutorsSnapshot.forEach((doc) => {
      const data = doc.data();
      tutors[data.name] = data.email;
    });

    // 2. formData.tutor 이름으로 이메일 찾기
    const tutorEmail = tutors[formData.tutor];
    const recipients = ["seheejang.korea@gmail.com"];

    if (tutorEmail) {
      recipients.push(tutorEmail);
    }

    // 3. 이메일 발송
    for (const email of recipients) {
      if (!email || typeof email !== "string" || !email.includes("@")) {
        continue;
      }

      const templateParams = {
        to_email: email,
        team_name: formData.teamName,
        tutor: formData.tutor,
        time: formData.timeSlot,
        link: formData.resourceLink,
        question: formData.question,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    }
  } catch (error) {
    console.error("❌ 이메일 전송 실패:", error);
  }
};
