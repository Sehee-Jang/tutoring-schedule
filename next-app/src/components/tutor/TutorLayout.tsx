// 좌측 사이드 + 메인 구조 레이아웃
import { ReactNode } from "react";
import Header from "@/components/tutor/Header";
import Sidebar from "@/components/tutor/Sidebar";

interface TutorLayoutProps {
  children: ReactNode;
}

const TutorLayout = ({ children }: TutorLayoutProps) => {
  return (
    <div className='flex flex-col h-screen bg-gray-50 px-8 py-6 gap-10'>
      <Header />

      <div className='flex flex-1 bg-gray-50 gap-5'>
        <aside className='w-[190px] border-1 border-gray-200 bg-white rounded-xl'>
          <Sidebar />
        </aside>

        <main className='flex-1 overflow-y-auto p-6 border-1 border-gray-200 bg-white rounded-xl'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default TutorLayout;
