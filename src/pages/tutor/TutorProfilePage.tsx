import TutorProfileForm from "../../components/tutor/profile/TutorProfileForm";
import { useToast } from "../../hooks/use-toast";

const TutorProfilePage = () => {
  const { toast } = useToast();

  return (
    <div className='max-w-xl mx-auto p-6'>
      <TutorProfileForm
        onSuccess={() => {
          toast({ title: "프로필이 저장되었습니다." });
        }}
      />
    </div>
  );
};

export default TutorProfilePage;
