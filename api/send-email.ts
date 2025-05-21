import { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  const {
    teamName,
    tutor,
    tutorEmail,
    timeSlot,
    resourceLink,
    question,
    isUpdate,
  } = req.body;

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

  try {
    const emailRes = await resend.emails.send({
      from: "튜터링 예약 시스템 <seheejang.korea@gmail.com>", // 인증된 주소
      to: [tutorEmail], // 튜터 이메일
      subject,
      html,
    });
    const emailId = (emailRes as { id?: string }).id;
    return res.status(200).json({ success: true, id: emailId });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
