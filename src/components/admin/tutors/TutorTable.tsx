import { Tutor, TutorStatus, ExtendedTutor } from "../../../types/tutor";
import Button from "../../shared/Button";
import StatusDropdown from "./StatusDropdown";

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
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full bg-white border rounded'>
        <thead>
          <tr className='bg-gray-100 text-left text-sm font-semibold'>
            <th className='p-3 border'>이름</th>
            <th className='p-3 border'>이메일</th>
            <th className='p-3 border'>조직</th>
            <th className='p-3 border'>트랙</th>
            <th className='p-3 border'>기수</th>
            <th className='p-3 border'>상태</th>
            <th className='p-3 border'>관리</th>
          </tr>
        </thead>
        <tbody>
          {tutors.map((tutor) => (
            <tr key={tutor.id} className='text-sm hover:bg-gray-50'>
              <td className='p-3 border'>{tutor.name}</td>
              <td className='p-3 border'>{tutor.email}</td>
              <td className='p-3 border'>{tutor.organizationName || "-"}</td>
              <td className='p-3 border'>{tutor.trackName || "-"}</td>
              <td className='p-3 border'>{tutor.batchNames || "-"}</td>
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
