import emailjs from "emailjs-com";

export const sendEmailAlert = async (formData) => {
  const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  console.log("✅ SERVICE_ID:", SERVICE_ID);
  console.log("✅ TEMPLATE_ID:", TEMPLATE_ID);
  console.log("✅ PUBLIC_KEY:", PUBLIC_KEY);

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        team_name: formData.teamName,
        tutor: formData.tutor,
        time: formData.timeSlot,
        figma: formData.figmaLink,
        question: formData.question,
      },
      PUBLIC_KEY
    );

    console.log("📨 이메일 전송 성공:", response.status);
  } catch (error) {
    console.error("❌ 이메일 전송 실패:", error);
  }
};
