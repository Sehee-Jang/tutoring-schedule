import emailjs from "emailjs-com";

export const sendEmailAlert = async (formData) => {
  const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  const tutorEmails = {
    김다희: process.env.REACT_APP_TUTOR_EMAIL_KIMDAHEE,
    김수진: process.env.REACT_APP_TUTOR_EMAIL_KIMSUJIN,
    김훈: process.env.REACT_APP_TUTOR_EMAIL_KIMHOON,
    남궁찬양: process.env.REACT_APP_TUTOR_EMAIL_NAMGOONGCHANYANG,
    박소연: process.env.REACT_APP_TUTOR_EMAIL_PARKSOYEON,
    송조해: process.env.REACT_APP_TUTOR_EMAIL_SONGJOHAE,
    오은화: process.env.REACT_APP_TUTOR_EMAIL_OEUNHWA,
    정기식: process.env.REACT_APP_TUTOR_EMAIL_JEONGGISIK,
    홍윤정: process.env.REACT_APP_TUTOR_EMAIL_HONGYUNJEONG,
  };

  const tutorEmail = tutorEmails[formData.tutor];
  const recipients = ["seheejang.korea@gmail.com"];

  if (tutorEmail) {
    recipients.push(tutorEmail);
  }

  try {
    for (const email of recipients) {
      if (!email || typeof email !== "string" || !email.includes("@")) {
        continue;
      }

      const templateParams = {
        to_email: email,
        team_name: formData.teamName,
        tutor: formData.tutor,
        time: formData.timeSlot,
        figma: formData.figmaLink,
        question: formData.question,
      };

      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );
    }
  } catch (error) {
    console.error("❌ 이메일 전송 실패:", error);
  }
};
