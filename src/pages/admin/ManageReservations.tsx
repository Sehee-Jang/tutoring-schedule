import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import DateSelector from "../../components/shared/DateSelector";
import ReservationDetailModal from "../../components/reservations/ReservationDetailModal";
import Button from "../../components/shared/Button";
import { cancelReservation } from "../../services/reservations";
import { useToast } from "../../hooks/use-toast";
import { db } from "../../services/firebase";
import type { Reservation, ReservationStatus } from "../../types/reservation";
import { TutorReservationProvider } from "../../context/ReservationContext";

const statusLabels: Record<ReservationStatus, string> = {
  reserved: "예약 완료",
  completed: "수업 완료",
  canceled: "취소됨",
};

const statusStyles: Record<ReservationStatus, string> = {
  reserved: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  canceled: "bg-red-100 text-red-700",
};

const ManageManagersPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const { toast } = useToast();

  const selectedDateString = useMemo(
    () => format(selectedDate, "yyyy-MM-dd"),
    [selectedDate]
  );

  useEffect(() => {
    setLoading(true);

    const reservationsRef = collection(db, "reservations");
    const reservationsQuery = query(
      reservationsRef,
      where("classDate", "==", selectedDateString),
      orderBy("timeSlot", "asc")
    );

    const unsubscribe = onSnapshot(
      reservationsQuery,
      (snapshot) => {
        const mappedReservations: Reservation[] = snapshot.docs.map(
          (docSnap) => {
            const data = docSnap.data();
            const createdAtValue = data.createdAt as
              | { toDate?: () => Date }
              | string
              | undefined;

            let createdAt: string | undefined;
            if (typeof createdAtValue === "string") {
              createdAt = createdAtValue;
            } else if (createdAtValue?.toDate) {
              createdAt = createdAtValue.toDate().toISOString();
            }

            const statusValue = data.status as ReservationStatus | undefined;
            const normalizedStatus: ReservationStatus =
              statusValue && statusLabels[statusValue]
                ? statusValue
                : "reserved";

            return {
              id: docSnap.id,
              userId: data.userId ?? "",
              tutor: data.tutor ?? "",
              date: data.date ?? "",
              timeSlot: data.timeSlot ?? "",
              status: normalizedStatus,
              teamName: data.teamName ?? "",
              question: data.question ?? "",
              resourceLink: data.resourceLink ?? "",
              classDate: data.classDate ?? selectedDateString,
              editPassword: data.editPassword ?? "",
              createdAt,
            } satisfies Reservation;
          }
        );

        setReservations(mappedReservations);
        setLoading(false);
      },
      (error) => {
        console.error("예약 데이터를 불러오는 중 오류가 발생했습니다.", error);
        setReservations([]);
        setLoading(false);
        toast({
          title: "❌ 예약 데이터를 불러오지 못했습니다.",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [selectedDateString, toast]);

  const handleView = (reservation: Reservation) => {
    setSelectedReservation(reservation);
  };

  const handleCancel = async (reservationId: string) => {
    const confirmed = window.confirm("예약을 취소하시겠습니까?");
    if (!confirmed) return;

    setCancelingId(reservationId);
    try {
      await cancelReservation(reservationId);
      toast({
        title: "예약이 성공적으로 취소되었습니다!",
        variant: "default",
      });
    } catch (error) {
      console.error("예약 취소 중 오류가 발생했습니다.", error);
      toast({
        title: "❌ 예약 취소 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <TutorReservationProvider selectedDate={selectedDateString}>
      <div className='space-y-6 sm:px-6 lg:px-8'>
        <h2 className='text-gray-700 text-xl font-semibold'>예약 관리</h2>

        <DateSelector date={selectedDate} setDate={setSelectedDate} />

        <div className='border border-gray-200 rounded-lg bg-white'>
          {loading ? (
            <div className='flex justify-center py-12'>
              <div className='h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent' />
            </div>
          ) : reservations.length === 0 ? (
            <div className='py-12 text-center text-gray-500'>
              선택한 날짜에 예약이 없습니다.
            </div>
          ) : (
            <div className='p-4'>
              <div className='hidden overflow-x-auto md:block'>
                <table className='w-full table-fixed border border-gray-200 text-sm'>
                  <thead>
                    <tr className='bg-gray-50 text-left text-gray-600'>
                      <th className='w-[160px] border p-3'>튜터</th>
                      <th className='w-[220px] border p-3'>팀/예약자</th>
                      <th className='w-[160px] border p-3'>시간대</th>
                      <th className='w-[140px] border p-3'>상태</th>
                      <th className='w-[180px] border p-3'>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr
                        key={reservation.id}
                        className='border-b text-gray-700 last:border-b-0 hover:bg-gray-50'
                      >
                        <td className='border p-3 font-medium'>
                          {reservation.tutor}
                        </td>
                        <td className='border p-3'>
                          <div className='font-medium text-gray-800'>
                            {reservation.teamName || "-"}
                          </div>
                          {reservation.userId && (
                            <div className='text-xs text-gray-400'>
                              ID: {reservation.userId}
                            </div>
                          )}
                        </td>
                        <td className='border p-3'>{reservation.timeSlot}</td>
                        <td className='border p-3'>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              statusStyles[reservation.status]
                            }`}
                          >
                            {statusLabels[reservation.status]}
                          </span>
                        </td>
                        <td className='border p-3'>
                          <div className='flex flex-wrap gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleView(reservation)}
                            >
                              보기
                            </Button>
                            <Button
                              variant='warning'
                              size='sm'
                              onClick={() => handleCancel(reservation.id)}
                              disabled={cancelingId === reservation.id}
                            >
                              {cancelingId === reservation.id
                                ? "취소 중..."
                                : "취소"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className='space-y-4 md:hidden'>
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className='rounded-lg border border-gray-200 p-4 shadow-sm'
                  >
                    <div className='flex justify-between gap-4'>
                      <div>
                        <p className='text-sm text-gray-500'>튜터</p>
                        <p className='font-semibold text-gray-800'>
                          {reservation.tutor}
                        </p>
                      </div>
                      <span
                        className={`inline-flex h-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyles[reservation.status]
                        }`}
                      >
                        {statusLabels[reservation.status]}
                      </span>
                    </div>

                    <div className='mt-3'>
                      <p className='text-sm text-gray-500'>팀/예약자</p>
                      <p className='font-medium text-gray-800'>
                        {reservation.teamName || "-"}
                      </p>
                      {reservation.userId && (
                        <p className='text-xs text-gray-400'>
                          ID: {reservation.userId}
                        </p>
                      )}
                    </div>

                    <div className='mt-3 text-sm text-gray-500'>
                      <span className='font-medium text-gray-700'>시간대:</span>{" "}
                      {reservation.timeSlot}
                    </div>

                    <div className='mt-4 flex flex-wrap gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleView(reservation)}
                      >
                        보기
                      </Button>
                      <Button
                        variant='warning'
                        size='sm'
                        onClick={() => handleCancel(reservation.id)}
                        disabled={cancelingId === reservation.id}
                      >
                        {cancelingId === reservation.id ? "취소 중..." : "취소"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <ReservationDetailModal
          isOpen={!!selectedReservation}
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          isAdmin
        />
      </div>
    </TutorReservationProvider>
  );
};

export default ManageManagersPage;
