// 좌측 사이드 + 메인 구조 레이아웃
import { ReactNode } from "react";
import Header from "../../components/tutor/Header";
import Sidebar from "../../components/tutor/Sidebar";

interface TutorLayoutProps {
  children: ReactNode;
}

const TutorLayout = ({ children }: TutorLayoutProps) => {
  return (
    <div className='flex flex-col h-screen bg-gray-50'>
      <Header />

      <div className='flex flex-1'>
        <aside className='w-[250px] border-r border-gray-200 bg-white'>
          <Sidebar />
        </aside>

        <main className='flex-1 overflow-y-auto bg-gray-50 p-6'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default TutorLayout;
