import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  mode: "signin" | "signup";
  onClose: () => void;
  onSubmit: (authData: {
    username: string;
    password: string;
    email?: string;
    rememberMe?: boolean;
    confirmPassword?: string;
    referralCode?: string;
  }) => Promise<void>;
  onSwitchMode: (mode: "signin" | "signup") => void;
  loading?: boolean;
  error?: string | null;
}

export default function AuthModal({
  isOpen,
  mode,
  onClose,
  onSubmit,
  onSwitchMode,
  loading = false,
  error = null,
}: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 클라이언트 측 유효성 검사
    if (!formData.email || !formData.password) {
      return;
    }

    if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        return;
      }
      if (formData.password.length < 6) {
        return;
      }
    }

    await onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSocialLogin = (provider: "kakao" | "naver") => {
    // 실제 환경에서는 소셜 로그인 API 연동
    alert(
      `${provider === "kakao" ? "카카오" : "네이버"} 로그인 기능은 준비 중입니다. 😊`,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* 모달 */}
      <div className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              src="https://ext.same-assets.com/3036106235/1111560219.svg"
              alt="SNS샵 로고"
              className="h-8 w-auto"
            />
            <h2 className="text-xl font-bold text-gray-900">
              {mode === "signin" ? "로그인" : "회원가입"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            disabled={loading}
          >
            <span className="text-gray-600">✕</span>
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-800">❌ {error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22426f] focus:border-transparent"
              placeholder="이메일을 입력하세요"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22426f] focus:border-transparent"
                placeholder="비밀번호를 입력하세요"
                required
                disabled={loading}
                minLength={mode === "signup" ? 6 : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {mode === "signup" && (
              <p className="text-xs text-gray-500 mt-1">
                6자 이상 입력해주세요
              </p>
            )}
          </div>

          {mode === "signup" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22426f] focus:border-transparent"
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {formData.password &&
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      비밀번호가 일치하지 않습니다
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  추천인 코드 (선택)
                </label>
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22426f] focus:border-transparent"
                  placeholder="추천인 코드를 입력하세요"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 추천인 코드 입력 시 5,000원 보너스!
                </p>
              </div>
            </>
          )}

          {mode === "signin" && (
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#22426f] border-gray-300 rounded focus:ring-[#22426f]"
                disabled={loading}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-600"
              >
                로그인 상태 유지
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              (mode === "signup" &&
                formData.password !== formData.confirmPassword)
            }
            className="w-full py-3 px-4 bg-[#22426f] text-white rounded-lg font-medium hover:bg-[#1e3b61] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner w-4 h-4 mr-2"></div>
                처리 중...
              </div>
            ) : mode === "signin" ? (
              "로그인"
            ) : (
              "회원가입"
            )}
          </button>

          {mode === "signin" && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-[#22426f] hover:underline"
                onClick={() =>
                  alert("비밀번호 재설정 기능은 준비 중입니다. 😊")
                }
                disabled={loading}
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>
          )}

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              {mode === "signin"
                ? "아직 계정이 없으신가요?"
                : "이미 계정이 있으신가요?"}
              <button
                type="button"
                onClick={() =>
                  onSwitchMode(mode === "signin" ? "signup" : "signin")
                }
                className="ml-1 text-[#22426f] hover:underline font-medium"
                disabled={loading}
              >
                {mode === "signin" ? "회원가입" : "로그인"}
              </button>
            </p>
          </div>
        </form>

        {/* 소셜 로그인 */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => handleSocialLogin("kakao")}
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <span className="mr-2">💬</span>
              카카오로 시작하기
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("naver")}
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <span className="mr-2">🟢</span>
              네이버로 시작하기
            </button>
          </div>
        </div>

        {/* SNS샵 고객센터 안내 */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">💡 고객센터 안내</div>
            <div className="text-xs">
              로그인 문제가 있으시면 카카오톡 상담을 이용해주세요.
              <br />
              평일 09:00 - 18:00 / 주말 및 공휴일 휴무
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
