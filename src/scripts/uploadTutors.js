import "dotenv/config";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase.js";

const tutors = [
  { name: "김다희", email: "daheesign@gmail.com" },
  { name: "김수진", email: "das.radioherz@gmail.com" },
  { name: "김훈", email: "kimhoony321@naver.com" },
  { name: "남궁찬양", email: "rjf0725@gmail.com" },
  { name: "박소연", email: "yany@ddokd.com" },
  { name: "송조해", email: "johaessi@gmail.com" },
  { name: "오은화", email: "sdwa5872@gmail.com" },
  { name: "정기식", email: "ggk234@gmail.com" },
  { name: "홍윤정", email: "intoaction5@naver.com" },
];

const uploadTutors = async () => {
  const tutorsRef = collection(db, "tutors");

  try {
    for (const tutor of tutors) {
      const docRef = doc(tutorsRef); // Firestore 자동 문서 ID 생성
      await setDoc(docRef, tutor);
      console.log(`추가 완료: ${tutor.name}`);
    }
    console.log("모든 튜터 정보가 성공적으로 업로드 되었습니다.");
  } catch (error) {
    console.error("튜터 정보 업로드 중 에러 발생:", error);
  }
};

uploadTutors();
