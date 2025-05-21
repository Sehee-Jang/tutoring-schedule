import * as functions from "firebase-functions";
import { Resend } from "resend";

const resend = new Resend(functions.config().resend.key);

interface EmailParams {
  teamName: string;
  tutor: string;
  timeSlot: string;
  resourceLink: string;
  question: string;
  isUpdate: boolean;
}

export const sendEmail = functions.https.onCall(
  async (request: functions.https.CallableRequest<EmailParams>) => {
    const { teamName, tutor, timeSlot, resourceLink, question, isUpdate } =
      request.data;

    const subject = isUpdate
      ? `[수정된 예약] ${teamName}님의 튜터링 예약`
      : `[새 예약] ${teamName}님의 튜터링 예약`;

    const html = `
      <h3>튜터링 예약 안내</h3>
      <p><strong>조 이름:</strong> ${teamName}</p>
      <p><strong>튜터:</strong> ${tutor}</p>
      <p><strong>시간:</strong> ${timeSlot}</p>
      <p><strong>링크:</strong> <a href="${resourceLink}">${resourceLink}</a></p>
      <p><strong>질문:</strong> ${question}</p>
    `;

    const recipients = ["seheejang.korea@gmail.com"];

    try {
      for (const email of recipients) {
        await resend.emails.send({
          from: "Sehee 예약 시스템 <your@verifieddomain.com>", // 인증된 주소
          to: email,
          subject,
          html,
        });
      }

      return { success: true };
    } catch (err: any) {
      console.error("❌ 이메일 전송 실패:", err.message);
      return { success: false, error: err.message };
    }
  }
);
