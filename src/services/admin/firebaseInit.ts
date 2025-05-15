import {
  createOrganization,
  createTrack,
  createRole,
  defaultRoles,
  createBatch,
} from "../firestore";

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

    // 2. 트랙 생성 (UXUI)
    const trackId = await createTrack(organizationId, "UXUI");
    console.log(`✅ 트랙 생성 완료: UXUI`);

    // 3. 기수 생성 (6기, 7기, 8기)
    const batches = [
      { name: "6기", startDate: "2025-01-01", endDate: "2025-06-30" },
      { name: "7기", startDate: "2025-07-01", endDate: "2025-12-31" },
      { name: "8기", startDate: "2026-01-01", endDate: "2026-06-30" },
    ];

    for (const batch of batches) {
      await createBatch(
        organizationId,
        trackId,
        batch.name,
        batch.startDate,
        batch.endDate
      );
      console.log(`✅ 기수 생성 완료: ${batch.name}`);
    }


    // 4. 기본 역할 생성 (Admin, Tutor, Student)
    for (const role of defaultRoles) {
      await createRole(organizationId, role.name, role.permissions);
      console.log(`✅ 역할 생성 완료: ${role.name}`);
    }

    console.log("✅ 내일배움캠프 초기화 완료");
  } catch (error) {
    console.error("❌ 초기화 오류:", error);
  }
}
