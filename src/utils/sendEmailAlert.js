import emailjs from "emailjs-com";

export const sendEmailAlert = async (formData) => {
  const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  const tutorEmails = {
    남궁찬양: process.env.REACT_APP_TUTOR_EMAIL_YUNSEO,
    예나연: process.env.REACT_APP_TUTOR_EMAIL_NAYEON,
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
