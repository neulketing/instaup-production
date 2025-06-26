import { useEffect, useState } from "react";
import {
  type MarketingRecommendation,
  type UserProfile,
  aiRecommendationService,
} from "../services/aiRecommendation";
import type { UserSession } from "../utils/auth";

interface AIRecommendationPanelProps {
  userSession: UserSession | null;
  onServiceSelect: (serviceId: string) => void;
}

export default function AIRecommendationPanel({
  userSession,
  onServiceSelect,
}: AIRecommendationPanelProps) {
  const [recommendations, setRecommendations] = useState<
    MarketingRecommendation[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (userSession) {
      generateRecommendations();
    }
  }, [userSession]);

  const generateRecommendations = async () => {
    if (!userSession) return;

    setLoading(true);
    try {
      // 사용자 프로필 생성 (실제 환경에서는 데이터베이스에서 가져옴)
      const userProfile: UserProfile = {
        id: userSession.id,
        platform: ["instagram"], // 사용자의 주문 이력 기반
        averageOrderAmount: 150000,
        orderFrequency: 2,
        preferredServices: ["instagram_followers", "instagram_likes"],
        lastOrderDate: new Date().toISOString(),
        totalSpent: userSession.balance + 500000, // 추정 총 지출
        accountAge: 30,
        successfulOrders: 8,
        canceledOrders: 1,
      };

      const recs =
        await aiRecommendationService.generatePersonalizedRecommendations(
          userProfile,
        );
      setRecommendations(recs);
    } catch (error) {
      console.error("추천 생성 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = (
    recommendation: MarketingRecommendation,
  ) => {
    // 추천 클릭 이벤트 추적
    if (window.gtag) {
      window.gtag("event", "ai_recommendation_click", {
        recommendation_id: recommendation.id,
        recommendation_type: recommendation.type,
        service: recommendation.targetService,
      });
    }

    onServiceSelect(recommendation.targetService);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "upsell":
        return "⬆️";
      case "service":
        return "🆕";
      case "promo":
        return "🎁";
      case "retention":
        return "💎";
      case "reactivation":
        return "🔄";
      default:
        return "💡";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "upsell":
        return "업그레이드 추천";
      case "service":
        return "새 서비스 추천";
      case "promo":
        return "프로모션";
      case "retention":
        return "고객 유지";
      case "reactivation":
        return "재활성화";
      default:
        return "추천";
    }
  };

  if (!userSession) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI 맞춤 추천
          </h3>
          <p className="text-gray-600 mb-4">
            로그인하시면 AI가 분석한 맞춤형 서비스를 추천해드립니다.
          </p>
          <div className="text-sm text-indigo-600">
            ✨ 개인화된 서비스 추천
            <br />📊 시장 트렌드 분석
            <br />💰 최적 가격 알림
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* 헤더 */}
      <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI 맞춤 추천</h3>
              <p className="text-sm text-gray-600">
                {userSession.name}님을 위한 개인화 추천
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateRecommendations}
              disabled={loading}
              className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 disabled:opacity-50 transition-colors"
            >
              {loading ? "🔄" : "새로고침"}
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <span
                className={`transform transition-transform ${expanded ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 추천 목록 */}
      {expanded && (
        <div className="p-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleRecommendationClick(rec)}
                >
                  {/* 추천 헤더 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(rec.type)}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {rec.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(rec.urgency)}`}
                          >
                            {rec.urgency === "high"
                              ? "긴급"
                              : rec.urgency === "medium"
                                ? "보통"
                                : "낮음"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {getTypeLabel(rec.type)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        +{rec.expectedRevenue.toLocaleString()}원 예상
                      </div>
                      <div className="text-xs text-gray-500">
                        신뢰도 {rec.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* 추천 내용 */}
                  <p className="text-sm text-gray-600 mb-3">
                    {rec.description}
                  </p>

                  {/* 할인/보너스 정보 */}
                  {(rec.discountPercent || rec.bonusAmount) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">
                          🎁 특별 혜택
                        </span>
                        {rec.discountPercent && (
                          <span className="text-green-800 font-bold">
                            {rec.discountPercent}% 할인
                          </span>
                        )}
                        {rec.bonusAmount && (
                          <span className="text-green-800 font-bold">
                            +{rec.bonusAmount.toLocaleString()}원 보너스
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 추천 이유 */}
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-700 mb-1">
                      추천 이유:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {rec.reasons.map((reason) => (
                        <span
                          key={reason}
                          className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA 버튼 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      ⏰ {new Date(rec.validUntil).toLocaleDateString()} 까지
                    </span>
                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-colors">
                      {rec.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-3">🤖</div>
              <p className="text-gray-600 mb-2">
                현재 추천할 서비스가 없습니다
              </p>
              <p className="text-sm text-gray-500">
                더 많은 서비스를 이용하시면 더 정확한 추천을 받을 수 있습니다.
              </p>
            </div>
          )}

          {/* AI 추천 정보 */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>🧠</span>
              <span>
                AI가 사용자의 주문 패턴, 선호도, 시장 트렌드를 분석하여 생성된
                추천입니다.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
