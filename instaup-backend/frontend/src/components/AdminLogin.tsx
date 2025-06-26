"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authManager } from "../utils/auth";

interface AdminLoginProps {
  onLoginSuccess: (adminData: any) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    adminKey: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 데모용 관리자 계정
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123",
    adminKey: "INSTAUP_ADMIN_2024",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 관리자 계정 검증
      if (
        formData.username === ADMIN_CREDENTIALS.username &&
        formData.password === ADMIN_CREDENTIALS.password &&
        formData.adminKey === ADMIN_CREDENTIALS.adminKey
      ) {
        // 관리자 세션 생성
        const adminSession = {
          id: "admin_001",
          username: formData.username,
          name: "시스템 관리자",
          email: "admin@instaup.kr",
          isAdmin: true,
          loginTime: new Date().toISOString(),
          permissions: ["all"],
        };

        // 로컬 스토리지에 관리자 세션 저장
        localStorage.setItem("adminSession", JSON.stringify(adminSession));

        onLoginSuccess(adminSession);
        navigate("/admin");
      } else {
        setError("관리자 인증 정보가 올바르지 않습니다.");
      }
    } catch (error) {
      setError("로그인 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 로고 및 제목 */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
            <span className="text-white font-bold text-2xl">🛡️</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">관리자 로그인</h2>
          <p className="text-gray-300">InstaUp 시스템 관리자 전용</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                관리자 아이디
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="관리자 아이디를 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                관리자 키
              </label>
              <input
                type="password"
                value={formData.adminKey}
                onChange={(e) =>
                  setFormData({ ...formData, adminKey: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="관리자 전용 키를 입력하세요"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  인증 중...
                </div>
              ) : (
                "관리자 로그인"
              )}
            </button>
          </form>

          {/* 데모 정보 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              📝 데모 계정 정보
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>
                아이디: <code className="bg-gray-200 px-1 rounded">admin</code>
              </div>
              <div>
                비밀번호:{" "}
                <code className="bg-gray-200 px-1 rounded">admin123</code>
              </div>
              <div>
                관리자 키:{" "}
                <code className="bg-gray-200 px-1 rounded">
                  INSTAUP_ADMIN_2024
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 링크 */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-gray-300 hover:text-white text-sm transition-colors"
          >
            ← 메인 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
