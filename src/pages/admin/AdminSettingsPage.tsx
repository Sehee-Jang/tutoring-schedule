import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useToast } from "../../hooks/use-toast";
import { Switch } from "../../components/ui/switch";
import Button from "../../components/shared/Button";
import { DeleteAlertDialog } from "../../components/shared/DeleteAlertDialog";
import SettingsCard from "../../components/admin/settings/SettingsCard";
import { OctagonAlert, RefreshCcw } from "lucide-react";
import { resetDatabase } from "../../services/admin/resetDatabase";
import { useAuth } from "../../context/AuthContext";
import { isSuperAdmin } from "../../utils/roleUtils";
import EmptyState from "../../components/admin/shared/EmptyState";
import { migrateBatchIdToBatchIds } from "../../services/admin/migrate";

const EMAIL_SETTINGS_DOC_ID = "production";

const AdminSettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // 이메일 설정 상태
  const [isEmailEnabled, setIsEmailEnabled] = useState(true);
  const [loadingEmail, setLoadingEmail] = useState(true);

  // DB 리셋 로딩 상태
  const [isResetting, setIsResetting] = useState(false);

  // DB 마이그레이션 상태
  const [isMigrating, setIsMigrating] = useState(false);

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

  // 이메일 초기화 실행 함수
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

  // 데이터베이스 리셋 실행 함수
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

  // 마이그레이션 실행 함수
  const handleMigrate = async () => {
    setIsMigrating(true);
    try {
      const updatedCount = await migrateBatchIdToBatchIds();
      toast({
        title: "마이그레이션 완료",
        description: `${updatedCount}명의 튜터 데이터가 변환되었습니다.`,
      });
    } catch (error) {
      console.error("마이그레이션 실패:", error);
      toast({
        title: "마이그레이션 실패",
        description: "예기치 않은 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  if (!user || !isSuperAdmin(user.role)) {
    return <EmptyState className='h-screen' message='접근 권한이 없습니다.' />;
  }

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
            <>
              <OctagonAlert className='w-4 h-4' />
              {isResetting ? "초기화 중..." : "초기화"}
            </>
          }
          triggerClassName='flex items-center gap-2'
          triggerSize='sm'
        />
      </SettingsCard>
      {/* 5NHpX8lr7oHNiiMvYlI7

F23nxRgyb2qWKtvklvBZ

IpDO0ua7EQN9bL0e2JH5
 */}

      {/* 배치 마이그레이션 카드 */}
      <SettingsCard
        title='기존 튜터 데이터 마이그레이션'
        description='기존에 단일 batchId로 저장된 튜터 데이터를 batchIds 배열로 변환합니다. 한 번만 실행하면 됩니다.'
        icon={<RefreshCcw className='text-blue-600 w-5 h-5' />}
      >
        <DeleteAlertDialog
          onConfirm={handleMigrate}
          triggerLabel={
            <>
              <RefreshCcw className='w-4 h-4' />
              {isMigrating ? "변환 중..." : "마이그레이션 실행"}
            </>
          }
          triggerClassName='flex items-center gap-2'
          triggerSize='sm'
        />
      </SettingsCard>
    </div>
  );
};

export default AdminSettingsPage;
