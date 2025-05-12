import {
  createOrganization,
  createTrack,
  createRole,
  defaultRoles,
} from "./firestore"

// 자동 초기화 함수
export async function initializeNaeilCamp() {
  try {
    // 1. 조직 생성
    const organizationId = await createOrganization(
      "내일배움캠프",
      "국비 지원 교육 캠프",
      ""
    );
    console.log(`✅ 조직 생성 완료: ${organizationId}`);

    // 2. 트랙 생성 (UXUI 6기)
    await createTrack(organizationId, "UXUI", "6기");
    console.log(`✅ 트랙 생성 완료: UXUI 6기`);

    // 3. 기본 역할 생성 (Admin, Tutor, Student)
    for (const role of defaultRoles) {
      await createRole(organizationId, role.name, role.permissions);
      console.log(`✅ 역할 생성 완료: ${role.name}`);
    }

    console.log("✅ 내일배움캠프 초기화 완료");
  } catch (error) {
    console.error("❌ 초기화 오류:", error);
  }
}