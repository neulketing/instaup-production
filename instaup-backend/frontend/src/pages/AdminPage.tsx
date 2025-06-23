import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";
import TossAdminDashboard from "../components/TossAdminDashboard";

interface AdminSession {
  id: string;
  username: string;
  name: string;
  email: string;
  isAdmin: boolean;
  loginTime: string;
  permissions: string[];
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  // 관리자 세션 확인
  useEffect(() => {
    const checkAdminSession = () => {
      const savedSession = localStorage.getItem("adminSession");
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          setAdminSession(session);
          setLoading(false);
          return;
        } catch (error) {
          console.error("관리자 세션 파싱 오류:", error);
          localStorage.removeItem("adminSession");
        }
      }
      setLoading(false);
    };

    checkAdminSession();
  }, []);

  const handleLoginSuccess = (session: AdminSession) => {
    setAdminSession(session);
  };

  const handleLogout = () => {
    if (confirm("정말로 로그아웃하시겠습니까?")) {
      localStorage.removeItem("adminSession");
      setAdminSession(null);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#3182F6] mx-auto mb-4"></div>
          <p className="text-[#6B7684] font-medium">관리자 시스템 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!adminSession) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <TossAdminDashboard />;
}
