// 좌측 사이드 + 메인 구조 레이아웃
import { ReactNode } from "react";
import Header from "@/components/tutor/shared/Header";
import Sidebar from "@/components/tutor/shared/Sidebar";

interface TutorLayoutProps {
  children: ReactNode;
  setViewMode: (mode: "timeSettings" | "reservations") => void;
  viewMode: "timeSettings" | "reservations";
}

const TutorLayout = ({ children, setViewMode, viewMode }: TutorLayoutProps) => {
  return (
    <div className='flex flex-col h-screen bg-gray-50 px-8 py-6 gap-10'>
      <Header />

      <div className='flex flex-1 bg-gray-50 gap-5'>
        <aside className='w-[190px] border-1 border-gray-200 bg-white rounded-xl'>
          <Sidebar setViewMode={setViewMode} viewMode={viewMode} />
        </aside>

        <main className='flex-1 overflow-y-auto p-6 border-1 border-gray-200 bg-white rounded-xl'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default TutorLayout;
