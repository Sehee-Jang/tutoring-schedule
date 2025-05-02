import emailjs from "emailjs-com";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export const sendEmailAlert = async (formData) => {
  const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  // 테스트용: 이메일 발송 끄기
  // if (process.env.REACT_APP_DISABLE_EMAIL === "true") {
  //   console.log(
  //     "📢 [테스트 모드] 이메일 발송이 비활성화되었습니다. 대신 예약 정보 출력:"
  //   );
  //   console.log(formData);
  //   return;
  // }

  try {
    // 1. Firestore users 콜렉션에서 role: "tutor"인 유저만 가져오기
    const usersRef = collection(db, "users");
    const tutorQuery = query(usersRef, where("role", "==", "tutor"));
    const snapshot = await getDocs(tutorQuery);

    const tutors = {};
    snapshot.forEach((doc) => {
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
