import emailjs from "@emailjs/browser";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";

interface EmailParams {
  teamName: string;
  tutor: string;
  timeSlot: string;
  resourceLink: string;
  question: string;
  isUpdate: boolean;
}

export const sendEmailAlert = async (formData: EmailParams) => {
  // console.log("📦 DISABLE_EMAIL =", process.env.VITE_DISABLE_EMAIL);

  // 이메일 설정 가져오기
  const settingsRef = doc(db, "email_settings", "production");
  const settingsSnap = await getDoc(settingsRef);
  const isDisabled = settingsSnap.exists()
    ? !settingsSnap.data().isEmailEnabled
    : false;

  if (isDisabled) {
    console.log("📢 [설정] 이메일 발송이 비활성화되었습니다.");
    console.log(formData);
    return;
  }

  const SERVICE_ID = process.env.VITE_EMAILJS_SERVICE_ID;
  // const TEMPLATE_ID = process.env.VITE_EMAILJS_TEMPLATE_ID;
  const TEMPLATE_ID = formData.isUpdate
    ? process.env.VITE_EMAILJS_UPDATE_TEMPLATE_ID
    : process.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = process.env.VITE_EMAILJS_PUBLIC_KEY;

  // 테스트용: 이메일 발송 끄기
  // if (process.env.VITE_DISABLE_EMAIL === "true") {
  //   console.log("📢 이메일 발송이 비활성화되었습니다. 대신 예약 정보 출력:");
  //   console.log(formData);
  //   return;
  // }

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error("EmailJS 환경변수가 설정되지 않았습니다.");
  }

  try {
    // 1. Firestore users 콜렉션에서 role: "tutor"인 유저만 가져오기
    const usersRef = collection(db, "users");
    const tutorQuery = query(usersRef, where("role", "==", "tutor"));
    const snapshot = await getDocs(tutorQuery);

    const tutors: Record<string, string> = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      tutors[data.name] = data.email;
    });

    // 2. formData.tutor 이름으로 이메일 찾기
    const tutorEmail = tutors[formData.tutor];
    // const recipients = ["seheejang.korea@gmail.com"]; // 관리자 필수 발송
    const recipients: string[] = [];

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
