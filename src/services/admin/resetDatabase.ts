import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// 데이터베이스 초기화 함수
export async function resetDatabase() {
  try {
    console.log("✅ Firestore 초기화 시작...");

    // 삭제할 컬렉션 목록
    const collections = ["organizations", "roles"];

    // 모든 컬렉션 삭제
    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);

      for (const docSnapshot of snapshot.docs) {
        const docRef = docSnapshot.ref;

        // 조직의 경우 서브컬렉션 (tracks)도 삭제
        if (collectionName === "organizations") {
          await deleteTracks(docRef.id);
        }

        await deleteDoc(docRef);
      }
      console.log(`✅ ${collectionName} 컬렉션 초기화 완료`);
    }

    // 새로운 초기 데이터 생성
    console.log("✅ 초기 데이터 생성 중...");
    await initializeDefaultData();
    console.log("✅ Firestore 초기화 및 초기 데이터 생성 완료");
  } catch (error) {
    console.error("❌ Firestore 초기화 오류:", error);
  }
}

// 트랙 삭제 (조직 서브컬렉션)
async function deleteTracks(organizationId: string) {
  const tracksRef = collection(db, `organizations/${organizationId}/tracks`);
  const tracksSnapshot = await getDocs(tracksRef);

  for (const trackDoc of tracksSnapshot.docs) {
    const trackRef = trackDoc.ref;

    // 트랙의 기수 서브컬렉션 삭제
    const batchesRef = collection(trackRef, "batches");
    const batchesSnapshot = await getDocs(batchesRef);

    for (const batchDoc of batchesSnapshot.docs) {
      await deleteDoc(batchDoc.ref);
    }
    console.log(`✅ 트랙 ${trackRef.id}의 기수 삭제 완료`);

    await deleteDoc(trackRef);
  }

  console.log(`✅ 조직 ${organizationId}의 트랙 삭제 완료`);
}

// 초기화할 기본 데이터 생성 함수
async function initializeDefaultData() {
  // 기본 조직 생성
  const orgRef = await addDoc(collection(db, "organizations"), {
    name: "내일배움캠프",
    description: "국비 지원 교육 캠프",
    logo_url: "",
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  const organizationId = orgRef.id;
  console.log(`✅ 조직 생성 완료: 내일배움캠프 (ID: ${organizationId})`);

  // 트랙 생성 (UXUI)
  const trackRef = await addDoc(
    collection(db, `organizations/${organizationId}/tracks`),
    {
      name: "UXUI",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    }
  );
  const trackId = trackRef.id;
  console.log(`✅ 트랙 생성 완료: UXUI`);

  // 기수 생성 (6기, 7기, 8기)
  const batches = [
    { name: "6기", startDate: "2025-01-01", endDate: "2025-05-30" },
    { name: "7기", startDate: "2025-07-01", endDate: "2025-12-31" },
    { name: "8기", startDate: "2026-01-01", endDate: "2026-06-30" },
  ];

  for (const batch of batches) {
    await addDoc(
      collection(
        db,
        `organizations/${organizationId}/tracks/${trackId}/batches`
      ),
      {
        name: batch.name,
        startDate: batch.startDate,
        endDate: batch.endDate,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      }
    );
    console.log(`✅ 기수 생성 완료: ${batch.name}`);
  }

  // 역할 생성 (admin, tutor, student) - 소문자로 저장
  const roles = [
    {
      name: "admin",
      permissions: {
        can_create_reservation: true,
        can_manage_users: true,
        can_view_all_reservations: true,
        can_edit_reservations: true,
      },
    },
    {
      name: "tutor",
      permissions: {
        can_view_assigned_reservations: true,
        can_edit_assigned_reservations: true,
        can_delete_assigned_reservations: true,
      },
    },
    {
      name: "student",
      permissions: {
        can_create_reservation: true,
        can_view_own_reservations: true,
        can_edit_own_reservations: true,
      },
    },
  ];

  for (const role of roles) {
    await addDoc(collection(db, "roles"), {
      name: role.name,
      permissions: role.permissions,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    console.log(`✅ 역할 생성 완료: ${role.name}`);
  }
}
