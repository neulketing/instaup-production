import { useEffect, useRef, useState } from "react";
import type { OrderItem } from "../types/orders";
import type { UserSession } from "../utils/auth";

interface ChatMessage {
  id: string;
  type: "user" | "agent" | "system";
  message: string;
  timestamp: string;
  attachments?: {
    type: "order";
    orderId: string;
    orderTitle: string;
  }[];
}

interface CustomerSupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession | null;
  userOrders?: OrderItem[];
}

export default function CustomerSupportChat({
  isOpen,
  onClose,
  userSession,
  userOrders = [],
}: CustomerSupportChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [showOrderSelect, setShowOrderSelect] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // 초기 환영 메시지
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        type: "system",
        message: `안녕하세요, ${userSession?.name || "고객"}님! 👋\n\nSNS샵 고객지원에 오신 것을 환영합니다.\n무엇을 도와드릴까요?`,
        timestamp: new Date().toISOString(),
      };

      const quickGuide: ChatMessage = {
        id: "guide",
        type: "agent",
        message:
          "💡 빠른 도움말:\n\n• 주문 관련 문의는 주문번호를 알려주세요\n• 📎 버튼으로 주문내역을 첨부할 수 있어요\n• 리필 요청, 진행 상황 확인 등 언제든 문의하세요!",
        timestamp: new Date().toISOString(),
      };

      setMessages([welcomeMessage, quickGuide]);
    }
  }, [isOpen, userSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: newMessage,
      timestamp: new Date().toISOString(),
      ...(selectedOrder && {
        attachments: [
          {
            type: "order",
            orderId: selectedOrder.id,
            orderTitle: selectedOrder.serviceName,
          },
        ],
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");
    setSelectedOrder(null);

    // 자동 응답 시뮬레이션
    setIsTyping(true);
    setTimeout(
      () => {
        const response = generateAutoResponse(newMessage, selectedOrder);
        setMessages((prev) => [...prev, response]);
        setIsTyping(false);
      },
      1000 + Math.random() * 2000,
    );
  };

  const generateAutoResponse = (
    message: string,
    order?: OrderItem | null,
  ): ChatMessage => {
    const lowerMsg = message.toLowerCase();

    // 주문 관련 키워드 감지
    if (
      lowerMsg.includes("주문") ||
      lowerMsg.includes("진행") ||
      lowerMsg.includes("상태")
    ) {
      if (order) {
        return {
          id: Date.now().toString() + "_response",
          type: "agent",
          message: `📋 ${order.serviceName} 주문 상태를 확인해드릴게요!\n\n• 주문번호: ${order.id}\n• 현재 상태: ${getStatusText(order.status)}\n• 진행률: ${order.progressPercentage}%\n• 예상 완료: ${order.estimatedCompletionTime}\n\n추가로 궁금한 점이 있으시면 언제든 말씀해주세요! 😊`,
          timestamp: new Date().toISOString(),
        };
      } else {
        return {
          id: Date.now().toString() + "_response",
          type: "agent",
          message:
            "주문 관련 문의는 구체적인 주문번호나 📎 주문첨부를 통해 알려주시면 더 정확한 안내가 가능해요! 어떤 주문에 대해 문의하시나요?",
          timestamp: new Date().toISOString(),
        };
      }
    }

    // 리필 관련
    if (
      lowerMsg.includes("리필") ||
      lowerMsg.includes("감소") ||
      lowerMsg.includes("줄어")
    ) {
      return {
        id: Date.now().toString() + "_response",
        type: "agent",
        message:
          '🔄 리필 관련 문의군요!\n\n리필 요청은 다음 조건에서 가능해요:\n• 주문 완료 후 수량 감소 시\n• 품질별 리필 보장기간 내\n  - VIP: 90일\n  - Premium: 60일  \n  - Standard: 30일\n\n주문내역에서 "리필 요청" 버튼을 클릭하시거나, 구체적인 주문번호를 알려주세요!',
        timestamp: new Date().toISOString(),
      };
    }

    // 결제/환불 관련
    if (
      lowerMsg.includes("결제") ||
      lowerMsg.includes("환불") ||
      lowerMsg.includes("취소")
    ) {
      return {
        id: Date.now().toString() + "_response",
        type: "agent",
        message:
          "💳 결제/환불 관련 문의는 중요한 사안이에요.\n\n• 서비스 시작 전: 취소 및 환불 가능\n• 서비스 진행 중: 부분 환불 가능\n• 서비스 완료 후: 환불 불가\n\n구체적인 상황을 알려주시면 정확한 안내를 도와드릴게요!",
        timestamp: new Date().toISOString(),
      };
    }

    // 계정/비밀번호 관련
    if (
      lowerMsg.includes("계정") ||
      lowerMsg.includes("비밀번호") ||
      lowerMsg.includes("로그인")
    ) {
      return {
        id: Date.now().toString() + "_response",
        type: "agent",
        message:
          '🔐 계정 관련 문의는 보안을 위해 추가 인증이 필요해요.\n\n• 비밀번호 재설정: 로그인 화면의 "비밀번호 찾기"\n• 계정 정보 변경: 계정설정 메뉴 이용\n• 기타 문제: 가입 시 이메일 주소로 본인 확인 후 도움\n\n어떤 문제가 있으신지 자세히 알려주세요!',
        timestamp: new Date().toISOString(),
      };
    }

    // 일반 응답
    const generalResponses = [
      "네, 말씀해주신 내용을 확인했어요. 더 구체적으로 어떤 도움이 필요하신지 알려주시겠어요?",
      "문의해주신 내용에 대해 정확한 안내를 위해 조금 더 자세한 정보가 필요해요. 어떤 상황인지 설명해주세요!",
      "고객님의 문의를 정확히 이해했는지 확인하고 싶어요. 혹시 주문번호나 관련 정보를 함께 알려주실 수 있나요?",
      "빠른 해결을 위해 구체적인 상황을 공유해주시면 더 정확한 도움을 드릴 수 있어요! 😊",
    ];

    return {
      id: Date.now().toString() + "_response",
      type: "agent",
      message:
        generalResponses[Math.floor(Math.random() * generalResponses.length)],
      timestamp: new Date().toISOString(),
    };
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: "대기중",
      processing: "처리중",
      in_progress: "진행중",
      completed: "완료",
      cancelled: "취소됨",
      refunded: "환불됨",
    };
    return statusMap[status] || status;
  };

  const attachOrder = (order: OrderItem) => {
    setSelectedOrder(order);
    setShowOrderSelect(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed bottom-0 right-4 w-96 h-[600px] bg-white rounded-t-lg shadow-2xl flex flex-col">
        {/* 헤더 */}
        <div className="bg-[#22426f] text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <h3 className="font-bold">고객지원 채팅</h3>
              <p className="text-xs opacity-80">실시간 상담 서비스</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20"
          >
            ✕
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] ${
                  msg.type === "user"
                    ? "bg-[#22426f] text-white"
                    : msg.type === "agent"
                      ? "bg-blue-50 text-blue-900"
                      : "bg-yellow-50 text-yellow-800"
                } rounded-lg p-3`}
              >
                <div className="text-sm whitespace-pre-line">{msg.message}</div>

                {/* 주문 첨부 표시 */}
                {msg.attachments &&
                  msg.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="mt-2 p-2 bg-white bg-opacity-20 rounded border"
                    >
                      <div className="text-xs opacity-80">첨부된 주문</div>
                      <div className="font-medium text-xs">
                        📋 {attachment.orderId} - {attachment.orderTitle}
                      </div>
                    </div>
                  ))}

                <div className="text-xs opacity-60 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {/* 타이핑 표시 */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <span className="text-xs text-gray-500 ml-2">
                    상담사가 입력 중...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 주문 첨부 선택 */}
        {showOrderSelect && (
          <div className="border-t p-3 max-h-40 overflow-y-auto">
            <div className="text-sm font-medium mb-2">주문 선택하기</div>
            {userOrders.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4">
                주문 내역이 없습니다
              </div>
            ) : (
              <div className="space-y-2">
                {userOrders.slice(0, 5).map((order) => (
                  <button
                    key={order.id}
                    onClick={() => attachOrder(order)}
                    className="w-full text-left p-2 rounded border hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-sm">
                      {order.serviceName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.id} • {getStatusText(order.status)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 선택된 주문 표시 */}
        {selectedOrder && (
          <div className="border-t p-3 bg-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium">첨부된 주문</div>
                <div className="text-xs text-gray-600">
                  {selectedOrder.id} - {selectedOrder.serviceName}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 입력 영역 */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setShowOrderSelect(!showOrderSelect)}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              title="주문 첨부"
            >
              📎
            </button>

            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#22426f] focus:ring-1 focus:ring-[#22426f]"
            />

            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="w-10 h-10 flex items-center justify-center bg-[#22426f] text-white rounded-lg hover:bg-[#1e3b61] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              📤
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-2 text-center">
            Enter로 전송 • 실시간 상담 서비스
          </div>
        </div>
      </div>
    </div>
  );
}
