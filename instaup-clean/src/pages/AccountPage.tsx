import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendApi } from "../services/backendApi";
import { authManager } from "../utils/auth";

interface ProfileData {
  nickname: string;
  email: string;
  referralCode: string;
  totalSpent: number;
  joinDate: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "referral"
  >("profile");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 프로필 수정 상태
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nickname: "",
  });

  // 비밀번호 변경 상태
  const [passwordForm, setPasswordForm] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const userSession = authManager.getCurrentSession();

  useEffect(() => {
    if (!userSession) {
      navigate("/");
      return;
    }
    fetchProfileData();
  }, [userSession]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await backendApi.getProfile();

      if (response.success && response.data) {
        const profile: ProfileData = {
          nickname: response.data.nickname,
          email: response.data.email,
          referralCode:
            userSession!.referralCode ||
            "INSTA" + Math.random().toString(36).substr(2, 6).toUpperCase(),
          totalSpent: response.data.totalSpent || 0,
          joinDate: response.data.createdAt,
        };
        setProfileData(profile);
        setProfileForm({ nickname: profile.nickname });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: "프로필 정보를 불러오는데 실패했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!profileForm.nickname.trim()) {
      setMessage({ type: "error", text: "닉네임을 입력해주세요." });
      return;
    }

    try {
      setSaving(true);
      const response = await backendApi.updateProfile({
        nickname: profileForm.nickname,
      });

      if (response.success) {
        setMessage({
          type: "success",
          text: "프로필이 성공적으로 업데이트되었습니다.",
        });
        setEditingProfile(false);
        await fetchProfileData();
      } else {
        setMessage({
          type: "error",
          text: response.error || "프로필 업데이트에 실패했습니다.",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "프로필 업데이트에 실패했습니다.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setMessage({ type: "error", text: "모든 필드를 입력해주세요." });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "새 비밀번호가 일치하지 않습니다." });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "새 비밀번호는 6자 이상이어야 합니다.",
      });
      return;
    }

    try {
      setSaving(true);
      const response = await backendApi.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );

      if (response.success) {
        setMessage({
          type: "success",
          text: "비밀번호가 성공적으로 변경되었습니다.",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage({
          type: "error",
          text: response.error || "비밀번호 변경에 실패했습니다.",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "비밀번호 변경에 실패했습니다.",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyReferralCode = () => {
    if (profileData?.referralCode) {
      navigator.clipboard.writeText(profileData.referralCode);
      setMessage({ type: "success", text: "추천인 코드가 복사되었습니다!" });
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/?ref=${profileData?.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setMessage({ type: "success", text: "추천인 링크가 복사되었습니다!" });
  };

  if (!userSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            로그인이 필요합니다
          </h2>
          <p className="text-gray-600 mb-4">
            계정 관리를 하려면 로그인해주세요.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-[#22426f] text-white rounded-lg hover:bg-[#1e3b61]"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <span className="text-xl">←</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">⚙️ 계정 관리</h1>
            </div>
            <div className="text-sm text-gray-600">
              잔액: {userSession.balance.toLocaleString()}원
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 메시지 표시 */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.text}
            <button
              onClick={() => setMessage(null)}
              className="float-right text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "profile"
                      ? "bg-[#22426f] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  👤 프로필 관리
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "password"
                      ? "bg-[#22426f] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  🔒 비밀번호 변경
                </button>
                <button
                  onClick={() => setActiveTab("referral")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "referral"
                      ? "bg-[#22426f] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  🎁 추천인 관리
                </button>
              </nav>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#22426f]"></div>
                <p className="mt-2 text-gray-600">
                  계정 정보를 불러오고 있습니다...
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* 프로필 관리 */}
                {activeTab === "profile" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                      👤 프로필 관리
                    </h2>

                    <div className="space-y-6">
                      {/* 기본 정보 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            이메일
                          </label>
                          <input
                            type="email"
                            value={profileData?.email || ""}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            이메일은 변경할 수 없습니다.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            닉네임
                          </label>
                          {editingProfile ? (
                            <input
                              type="text"
                              value={profileForm.nickname}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  nickname: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="닉네임을 입력하세요"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={profileData?.nickname || ""}
                                disabled
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                              />
                              <button
                                onClick={() => setEditingProfile(true)}
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                              >
                                수정
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 통계 정보 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            총 사용 금액
                          </label>
                          <input
                            type="text"
                            value={`${profileData?.totalSpent.toLocaleString() || 0}원`}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            가입일
                          </label>
                          <input
                            type="text"
                            value={
                              profileData
                                ? new Date(
                                    profileData.joinDate,
                                  ).toLocaleDateString("ko-KR")
                                : ""
                            }
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                          />
                        </div>
                      </div>

                      {/* 프로필 수정 버튼 */}
                      {editingProfile && (
                        <div className="flex gap-2">
                          <button
                            onClick={handleProfileUpdate}
                            disabled={saving}
                            className="px-4 py-2 bg-[#22426f] text-white rounded-lg hover:bg-[#1e3b61] disabled:opacity-50"
                          >
                            {saving ? "저장 중..." : "저장"}
                          </button>
                          <button
                            onClick={() => {
                              setEditingProfile(false);
                              setProfileForm({
                                nickname: profileData?.nickname || "",
                              });
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            취소
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 비밀번호 변경 */}
                {activeTab === "password" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                      🔒 비밀번호 변경
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          현재 비밀번호
                        </label>
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="현재 비밀번호를 입력하세요"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          새 비밀번호
                        </label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="새 비밀번호를 입력하세요 (6자 이상)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          새 비밀번호 확인
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="새 비밀번호를 다시 입력하세요"
                        />
                      </div>

                      <button
                        onClick={handlePasswordChange}
                        disabled={saving}
                        className="px-4 py-2 bg-[#22426f] text-white rounded-lg hover:bg-[#1e3b61] disabled:opacity-50"
                      >
                        {saving ? "변경 중..." : "비밀번호 변경"}
                      </button>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="text-sm text-yellow-800">
                          <div className="font-medium mb-1">⚠️ 주의사항</div>
                          <ul className="text-xs space-y-1 list-disc list-inside">
                            <li>비밀번호는 6자 이상으로 설정해주세요</li>
                            <li>
                              영문, 숫자, 특수문자를 조합하면 더 안전합니다
                            </li>
                            <li>
                              다른 사이트와 동일한 비밀번호는 사용하지 마세요
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 추천인 관리 */}
                {activeTab === "referral" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                      🎁 추천인 관리
                    </h2>

                    <div className="space-y-6">
                      {/* 나의 추천인 코드 */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-4">
                          나의 추천인 코드
                        </h3>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-[#22426f] mb-2">
                              {profileData?.referralCode}
                            </div>
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={copyReferralCode}
                                className="px-3 py-1 text-sm bg-white text-[#22426f] border border-[#22426f] rounded-lg hover:bg-[#22426f] hover:text-white transition-colors"
                              >
                                코드 복사
                              </button>
                              <button
                                onClick={copyReferralLink}
                                className="px-3 py-1 text-sm bg-[#22426f] text-white rounded-lg hover:bg-[#1e3b61] transition-colors"
                              >
                                링크 복사
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 추천인 혜택 */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-4">
                          추천인 혜택
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="text-green-800">
                              <div className="font-medium mb-1">
                                💰 추천인 보상
                              </div>
                              <div className="text-sm">
                                • 신규 회원 가입 시: 10,000원
                                <br />• 추천 받은 회원 첫 주문 시: 주문금액의 5%
                              </div>
                            </div>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="text-blue-800">
                              <div className="font-medium mb-1">
                                🎯 누적 혜택
                              </div>
                              <div className="text-sm">
                                • 추천 인원 10명 달성: 추가 50,000원
                                <br />• 추천 인원 50명 달성: 추가 300,000원
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 추천 통계 (임시 데이터) */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-4">
                          추천 통계
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 border border-gray-200 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">
                              0
                            </div>
                            <div className="text-sm text-gray-600">
                              총 추천인원
                            </div>
                          </div>
                          <div className="text-center p-4 border border-gray-200 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">
                              0원
                            </div>
                            <div className="text-sm text-gray-600">
                              추천 수익
                            </div>
                          </div>
                          <div className="text-center p-4 border border-gray-200 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">
                              0
                            </div>
                            <div className="text-sm text-gray-600">이번 달</div>
                          </div>
                          <div className="text-center p-4 border border-gray-200 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">
                              10,000원
                            </div>
                            <div className="text-sm text-gray-600">
                              가입 보너스
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
