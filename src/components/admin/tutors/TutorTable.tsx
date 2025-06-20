import { useState } from "react";
import { Tutor, TutorStatus, ExtendedTutor } from "../../../types/tutor";
import Button from "../../shared/Button";
import StatusDropdown from "./StatusDropdown";
import SortableHeader from "../../shared/SortableHeader";
import { SortOption } from "../../../types/sort";
import OrganizationDropdown from "./OrganizationDropdown";
import TrackDropdown from "./TrackDropdown";
import BatchDropdown from "./BatchDropdown";

interface TutorTableProps {
  tutors: ExtendedTutor[];
  onEdit: (tutor: Tutor) => void;
  onChangeStatus: (tutor: Tutor, newStatus: TutorStatus) => void;
  onShowAvailability: (tutorId: string) => void;
}

const TutorTable: React.FC<TutorTableProps> = ({
  tutors,
  onEdit,
  onChangeStatus,
  onShowAvailability,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>({
    key: "name",
    direction: "asc",
  });

  const handleSortChange = (key: string) => {
    setSortOption((prev) => {
      if (prev.key === key) {
        const nextDirection =
          prev.direction === "asc"
            ? "desc"
            : prev.direction === "desc"
            ? null
            : "asc";
        return { key, direction: nextDirection };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedTutors = [...tutors].sort((a, b) => {
    const { key, direction } = sortOption;
    if (!direction) return 0;

    const aValue = a[key as keyof ExtendedTutor] ?? "";
    const bValue = b[key as keyof ExtendedTutor] ?? "";

    return direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  return (
    <div className='overflow-x-auto'>
      <table className='w-full table-fixed bg-white border rounded'>
        <thead>
          <tr className='bg-gray-50 text-left text-sm text-gray-500'>
            <th className='p-3 border w-[120px]'>
              <SortableHeader
                label='이름'
                sortKey='name'
                currentSort={sortOption}
                onSortChange={handleSortChange}
              />
            </th>
            <th className='p-3 border w-[200px]'>
              <SortableHeader
                label='이메일'
                sortKey='email'
                currentSort={sortOption}
                onSortChange={handleSortChange}
              />
            </th>
            <th className='p-3 border w-[160px]'>
              <SortableHeader
                label='조직'
                sortKey='organizationName'
                currentSort={sortOption}
                onSortChange={handleSortChange}
              />
            </th>
            <th className='p-3 border w-[160px]'>
              <SortableHeader
                label='트랙'
                sortKey='trackName'
                currentSort={sortOption}
                onSortChange={handleSortChange}
              />
            </th>
            <th className='p-3 border w-[180px]'>
              <SortableHeader
                label='기수'
                sortKey='batchNames'
                currentSort={sortOption}
                onSortChange={handleSortChange}
              />
            </th>
            <th className='p-3 border w-[120px]'>
              <SortableHeader
                label='상태'
                sortKey='status'
                currentSort={sortOption}
                onSortChange={handleSortChange}
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
              <td className='p-3 border'>
                <OrganizationDropdown
                  tutorId={tutor.id}
                  currentOrgId={tutor.organizationId}
                />
              </td>
              <td className='p-3 border'>
                <TrackDropdown
                  tutorId={tutor.id}
                  organizationId={tutor.organizationId}
                  currentTrackId={tutor.trackId}
                />
              </td>
              <td className='p-3 border'>
                {/* <div className='flex flex-wrap gap-1'>
                  {Array.isArray(tutor.batchNames) &&
                  tutor.batchNames.length > 0 ? (
                    tutor.batchNames.map((name: string, i: number) => (
                      <span
                        key={i}
                        className='px-2 py-0.5 text-xs font-medium rounded-full bg-[#F1F5FF] text-[#1E40AF] border border-[#93C5FD]'
                      >
                        {name}
                      </span>
                    ))
                  ) : (
                    <span className='text-gray-400 text-sm'>-</span>
                  )}
                </div> */}
                <BatchDropdown
                  tutorId={tutor.id}
                  currentBatchIds={tutor.batchIds ?? []}
                  organizationId={tutor.organizationId}
                  trackId={tutor.trackId}
                />
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
  );
};

export default TutorTable;
