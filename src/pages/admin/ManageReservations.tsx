import EmptyState from "../../components/admin/shared/EmptyState";

const ManageReservations = () => {
  return (
    <div className='space-y-4'>
      <h2 className='text-gray-700 text-xl font-semibold mb-4'>예약 관리</h2>

      <EmptyState
        className='h-screen'
        message='예약 관리 기능이 추가될 예정입니다.'
      />
    </div>
  );
};

export default ManageReservations;
