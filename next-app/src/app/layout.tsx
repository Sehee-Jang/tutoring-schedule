//앱 전체에 공통 적용되는 레이아웃과 context providers 정의 CRA에서 App.tsx가 하던 역할을 여기에 나눠서 하는 구조임
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import { AvailabilityProvider } from "@/context/AvailabilityContext";
import { ReservationProvider } from "@/context/ReservationContext";
import { TutorProvider } from "@/context/TutorContext";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { HolidayProvider } from "@/context/HolidayContext";

export const metadata = {
  title: "튜터링 스케줄러",
  description: "튜터링 예약을 쉽게 관리해보세요!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko'>
      <body>
        <AuthProvider>
          <ModalProvider>
            <AvailabilityProvider>
              <ReservationProvider>
                <TutorProvider>
                  <HolidayProvider>
                    <ToastProvider />
                    {children}
                    <Toaster />
                  </HolidayProvider>
                </TutorProvider>
              </ReservationProvider>
            </AvailabilityProvider>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
