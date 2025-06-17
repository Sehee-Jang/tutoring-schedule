import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useToast } from "../../hooks/use-toast";

import { Switch } from "../../components/ui/switch";
import Button from "../../components/shared/Button";
import { DeleteAlertDialog } from "../../components/shared/DeleteAlertDialog";
import SettingsCard from "../../components/admin/settings/SettingsCard";

import { OctagonAlert } from "lucide-react";
import { resetDatabase } from "../../services/admin/resetDatabase";

const EMAIL_SETTINGS_DOC_ID = "production";

const AdminSettingsPage = () => {
  const { toast } = useToast();

  // 이메일 설정 상태
  const [isEmailEnabled, setIsEmailEnabled] = useState(true);
  const [loadingEmail, setLoadingEmail] = useState(true);

  // DB 리셋 로딩 상태
  const [isResetting, setIsResetting] = useState(false);

  // 이메일 설정 불러오기
  useEffect(() => {
    const fetchEmailSetting = async () => {
      const docRef = doc(db, "email_settings", EMAIL_SETTINGS_DOC_ID);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setIsEmailEnabled(snapshot.data().isEmailEnabled);
      }
      setLoadingEmail(false);
    };

    fetchEmailSetting();
  }, []);

  const handleEmailToggle = async (checked: boolean) => {
    setIsEmailEnabled(checked);
    try {
      await setDoc(
        doc(db, "email_settings", EMAIL_SETTINGS_DOC_ID),
        {
          isEmailEnabled: checked,
        },
        { merge: true }
      );

      toast({
        title: `이메일 발송이 ${checked ? "활성화" : "비활성화"}되었습니다.`,
      });
    } catch (err) {
      console.error("이메일 설정 저장 실패:", err);
      toast({
        title: "이메일 설정 저장 실패",
        variant: "destructive",
      });
    }
  };

  const handleResetDatabase = async () => {
    setIsResetting(true);
    try {
      await resetDatabase();
      toast({ title: "데이터베이스가 초기화되었습니다." });
    } catch (error) {
      console.error("초기화 실패:", error);
      toast({
        title: "초기화 실패",
        description: "예기치 않은 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className='space-y-10'>
      <h1 className='text-xl font-bold'>설정 관리</h1>

      {/* 이메일 발송 설정 카드 */}
      <SettingsCard
        title='이메일 발송 설정'
        description='예약 등록 또는 수정 시, 튜터에게 이메일 알림을 보낼지 여부를 설정합니다.'
      >
        {!loadingEmail && (
          <Switch
            checked={isEmailEnabled}
            onCheckedChange={handleEmailToggle}
          />
        )}
      </SettingsCard>

      {/* 데이터베이스 리셋 카드 */}
      <SettingsCard
        title='데이터베이스 초기화'
        description='전체 데이터를 초기화합니다. 이 작업은 되돌릴 수 없으며, 실행 시 모든
        예약, 사용자, 설정 데이터가 삭제됩니다. 반드시 백업 후 진행하세요.'
        icon={<OctagonAlert className='text-red-600 w-5 h-5' />}
        borderColor='border-red-300'
      >
        <DeleteAlertDialog
          onConfirm={handleResetDatabase}
          triggerLabel={
            <Button
              variant='warning'
              size='sm'
              disabled={isResetting}
              className='flex items-center gap-2'
            >
              <OctagonAlert className='w-4 h-4' />
              {isResetting ? "초기화 중..." : "초기화"}
            </Button>
          }
        />
      </SettingsCard>
    </div>
  );
};

export default AdminSettingsPage;
