import { useEffect, useState } from "react";
import { Tutor, TutorStatus, ExtendedTutor } from "../../../types/tutor";
import Button from "../../shared/Button";
import StatusDropdown from "./StatusDropdown";
import SortableHeader from "../../shared/SortableHeader";
import { SortOption } from "../../../types/sort";
import OrganizationDropdown from "./OrganizationDropdown";
import TrackDropdown from "./TrackDropdown";
import BatchDropdown from "./BatchDropdown";
import { useAuth } from "../../../context/AuthContext";
import { isSuperAdmin } from "../../../utils/roleUtils";
import ColumnHeaderWithMenu from "../../shared/ColumnHeaderWithMenu";
import { FilterValues } from "../../../types/tutor";

interface OptionItem {
  id: string;
  name: string;
}

interface TutorTableProps {
  tutors: ExtendedTutor[];
  filters: FilterValues;
  onFilterChange: (newFilters: Partial<FilterValues>) => void;
  organizationOptions: OptionItem[];
  trackOptions: OptionItem[];
  batchOptions: OptionItem[];
  onEdit: (tutor: Tutor) => void;
  onChangeStatus: (tutor: Tutor, newStatus: TutorStatus) => void;
  onShowAvailability: (tutorId: string) => void;
  setSelectedOrgId: (id: string) => void;
  setSelectedTrackId: (id: string) => void;
}

const TutorTable: React.FC<TutorTableProps> = ({
  tutors,
  filters,
  onFilterChange,
  organizationOptions,
  trackOptions,
  batchOptions,
  onEdit,
  onChangeStatus,
  onShowAvailability,
  setSelectedOrgId,
  setSelectedTrackId,
}) => {
  const { user } = useAuth();
  const [sortOption, setSortOption] = useState<SortOption>({
    key: "name",
    direction: "asc",
  });

  // ✅ 필터가 바뀌었을 때 트랙/기수 연동
  useEffect(() => {
    if (filters.organizationId) {
      setSelectedOrgId(filters.organizationId);
    }
    if (!filters.organizationId) {
      setSelectedTrackId(""); // 조직이 바뀌면 트랙도 초기화
    }
  }, [filters.organizationId]);

  useEffect(() => {
    if (filters.trackId) {
      setSelectedTrackId(filters.trackId);
      // ✅ 트랙 변경 시 기수 초기화
      onFilterChange({ batchIds: [] });
    }
  }, [filters.trackId]);

  useEffect(() => {
    if (filters.batchIds.length > 0) {
      onFilterChange({ trackId: "" }); // ✅ 기수 선택 시 트랙 초기화
      setSelectedTrackId("");
    }
  }, [filters.batchIds]);

  useEffect(() => {
    console.log("🔥 orgOptions:", organizationOptions);
    console.log("🔥 trackOptions:", trackOptions);
    console.log("🔥 batchOptions:", batchOptions);
  }, [organizationOptions, trackOptions, batchOptions]);

  useEffect(() => {
    console.log("👀 Table 내부에서 받은 batchOptions:", batchOptions);
  }, [batchOptions]);

  const handleSortChange = (key: string, direction: "asc" | "desc") => {
    setSortOption({ key, direction });
  };

  const filteredTutors = tutors.filter((tutor) => {
    // 이름 필터
    if (filters.name && tutor.name !== filters.name) return false;

    // 이메일 필터
    if (filters.email && tutor.email !== filters.email) return false;

    // 조직 필터
    if (
      filters.organizationId &&
      tutor.organizationId !== filters.organizationId
    )
      return false;

    // 트랙 필터
    if (filters.trackId && tutor.trackId !== filters.trackId) return false;

    // 기수 필터
    if (filters.batchIds.length > 0) {
      const hasOverlap = (tutor.batchIds || []).some((id) =>
        filters.batchIds.includes(id)
      );
      if (!hasOverlap) return false;
    }

    // 상태 필터
    if (filters.status && tutor.status !== filters.status) return false;

    return true;
  });

  const sortedTutors = [...filteredTutors].sort((a, b) => {
    const { key, direction } = sortOption;
    if (!direction) return 0;

    const aValue = a[key as keyof ExtendedTutor] ?? "";
    const bValue = b[key as keyof ExtendedTutor] ?? "";

    return direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const statusMap: Record<TutorStatus, string> = {
    pending: "승인대기",
    active: "활성",
    inactive: "비활성",
  };

  return (
    <div className='w-full'>
      {/* 데스크탑 테이블 */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='w-full table-fixed bg-white border rounded'>
          <thead>
            <tr className='bg-gray-50 text-left text-sm text-gray-500'>
              <th className='p-3 border w-[120px]'>
                <ColumnHeaderWithMenu
                  columnKey='name'
                  label='이름'
                  filterOptions={[...new Set(tutors.map((t) => t.name || "-"))]}
                  selectedFilters={[]}
                  onSortChange={handleSortChange}
                  onFilterChange={(key, values) => {
                    onFilterChange({ [key]: values[0] });
                  }}
                />
              </th>
              <th className='p-3 border w-[200px]'>
                <ColumnHeaderWithMenu
                  columnKey='email'
                  label='이메일'
                  filterOptions={[...new Set(tutors.map((t) => t.email))]}
                  selectedFilters={[]}
                  onSortChange={handleSortChange}
                  onFilterChange={(key, values) => {
                    onFilterChange({ email: values[0] });
                  }}
                />
              </th>
              {isSuperAdmin(user?.role) && (
                <th className='px-4 py-2 text-left font-medium w-[160px]'>
                  <ColumnHeaderWithMenu
                    columnKey='organizationName'
                    label='조직'
                    filterOptions={organizationOptions.map((o) => o.name)}
                    selectedFilters={
                      filters.organizationId
                        ? [
                            organizationOptions.find(
                              (o) => o.id === filters.organizationId
                            )?.name || "",
                          ]
                        : []
                    }
                    onSortChange={handleSortChange}
                    onFilterChange={(key, values) => {
                      const selected = organizationOptions.find(
                        (o) => o.name === values[0]
                      );
                      const id = selected?.id || "";
                      onFilterChange({ organizationId: id });
                    }}
                  />
                </th>
              )}
              <th className='p-3 border w-[160px]'>
                <ColumnHeaderWithMenu
                  columnKey='trackName'
                  label='트랙'
                  filterOptions={trackOptions.map((t) => t.name)}
                  selectedFilters={
                    filters.trackId
                      ? [
                          trackOptions.find((t) => t.id === filters.trackId)
                            ?.name || "",
                        ]
                      : []
                  }
                  onSortChange={handleSortChange}
                  onFilterChange={(key, values) => {
                    const selectedTrack = trackOptions.find(
                      (t) => t.name === values[0]
                    );
                    const id = selectedTrack?.id || "";
                    onFilterChange({ trackId: id });
                  }}
                />
              </th>
              <th className='p-3 border w-[180px]'>
                <ColumnHeaderWithMenu
                  columnKey='batchNames'
                  label='기수'
                  filterOptions={batchOptions.map((b) => b.name)}
                  selectedFilters={
                    filters.batchIds.length > 0
                      ? batchOptions
                          .filter((b) => filters.batchIds.includes(b.id))
                          .map((b) => b.name)
                      : []
                  }
                  onSortChange={handleSortChange}
                  onFilterChange={(key, values) => {
                    const selected = batchOptions
                      .filter((b) => values.includes(b.name))
                      .map((b) => b.id);
                    onFilterChange({ batchIds: selected });
                  }}
                />
              </th>
              <th className='p-3 border w-[120px]'>
                <ColumnHeaderWithMenu
                  columnKey='status'
                  label='상태'
                  filterOptions={Object.values(statusMap)}
                  selectedFilters={
                    filters.status
                      ? [statusMap[filters.status as TutorStatus]]
                      : []
                  }
                  onSortChange={handleSortChange}
                  onFilterChange={(key, values) => {
                    const englishKey = Object.entries(statusMap).find(
                      ([_, label]) => label === values[0]
                    )?.[0] as TutorStatus;
                    onFilterChange({ status: englishKey });
                  }}
                />
              </th>
              <th className='p-3 border w-[160px]'>관리</th>
            </tr>
          </thead>
          <tbody>
            {sortedTutors.map((tutor) => (
              <tr key={tutor.id} className='text-sm hover:bg-gray-50'>
                <td className='p-3 border'>{tutor.name}</td>
                <td className='p-3 border'>{tutor.email}</td>
                {isSuperAdmin(user?.role) && (
                  <td className='p-3 border'>
                    <OrganizationDropdown
                      tutorId={tutor.id}
                      currentOrgId={tutor.organizationId}
                    />
                  </td>
                )}
                <td className='p-3 border'>
                  {isSuperAdmin(user?.role) ||
                  user?.role === "organization_admin" ? (
                    <TrackDropdown
                      tutorId={tutor.id}
                      organizationId={tutor.organizationId}
                      currentTrackId={tutor.trackId}
                    />
                  ) : (
                    <span>{tutor.trackName || "-"}</span>
                  )}
                </td>
                <td className='p-3 border'>
                  {[
                    "super_admin",
                    "organization_admin",
                    "track_admin",
                  ].includes(user?.role ?? "") ? (
                    <BatchDropdown
                      tutorId={tutor.id}
                      currentBatchIds={tutor.batchIds ?? []}
                      organizationId={tutor.organizationId}
                      trackId={tutor.trackId}
                    />
                  ) : (
                    <div className='flex flex-wrap gap-1'>
                      {(tutor.batchNames || []).map((name, i) => (
                        <span
                          key={i}
                          className='px-2 py-0.5 text-xs font-medium rounded-full bg-[#F1F5FF] text-[#1E40AF] border border-[#93C5FD]'
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className='p-3 border'>
                  <StatusDropdown
                    currentStatus={tutor.status}
                    onChange={(newStatus) => onChangeStatus(tutor, newStatus)}
                  />
                </td>
                <td className='p-3 border space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onEdit(tutor)}
                  >
                    수정
                  </Button>
                  <Button
                    variant='primary'
                    size='sm'
                    onClick={() => onShowAvailability(tutor.id)}
                  >
                    가능 시간
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드형 */}
      <div className='block md:hidden space-y-4'>
        {sortedTutors.map((tutor) => (
          <div key={tutor.id} className='border rounded p-4 bg-white shadow-sm'>
            <div className='font-semibold text-lg'>{tutor.name}</div>
            <div className='text-sm text-gray-600'>{tutor.email}</div>
            <div className='mt-2 text-sm'>
              <span className='font-medium'>트랙:</span>{" "}
              {tutor.trackName || "-"}
            </div>
            <div className='text-sm'>
              <span className='font-medium'>기수:</span>{" "}
              {(tutor.batchNames || []).join(", ") || "-"}
            </div>
            <div className='text-sm'>
              <span className='font-medium'>상태:</span>{" "}
              {statusMap[tutor.status]}
            </div>
            <div className='mt-3 flex gap-2'>
              <Button variant='outline' size='sm' onClick={() => onEdit(tutor)}>
                수정
              </Button>
              <Button
                variant='primary'
                size='sm'
                onClick={() => onShowAvailability(tutor.id)}
              >
                가능 시간
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorTable;
