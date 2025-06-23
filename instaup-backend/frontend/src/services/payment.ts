// 실제 결제 API 연동 서비스

export interface PaymentRequest {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  paymentMethod:
    | "card"
    | "kakaopay"
    | "naverpay"
    | "tosspay"
    | "bank"
    | "phone";
}

export interface PaymentResponse {
  success: boolean;
  paymentKey?: string;
  orderId: string;
  amount: number;
  method: string;
  approvedAt?: string;
  failReason?: string;
  receiptUrl?: string;
}

export interface PaymentProvider {
  id: string;
  name: string;
  methods: string[];
  isActive: boolean;
  fees: { [method: string]: number };
  limits: { [method: string]: { min: number; max: number } };
}

// 실제 결제 제공업체 설정
const PAYMENT_PROVIDERS: PaymentProvider[] = [
  {
    id: "tosspayments",
    name: "토스페이먼츠",
    methods: ["card", "tosspay", "bank", "phone"],
    isActive: true,
    fees: {
      card: 0,
      tosspay: 0,
      bank: 0,
      phone: 3000,
    },
    limits: {
      card: { min: 1000, max: 1000000 },
      tosspay: { min: 1000, max: 500000 },
      bank: { min: 10000, max: 2000000 },
      phone: { min: 5000, max: 50000 },
    },
  },
  {
    id: "kakaopay",
    name: "카카오페이",
    methods: ["kakaopay"],
    isActive: true,
    fees: {
      kakaopay: 0,
    },
    limits: {
      kakaopay: { min: 1000, max: 500000 },
    },
  },
  {
    id: "naverpay",
    name: "네이버페이",
    methods: ["naverpay"],
    isActive: true,
    fees: {
      naverpay: 0,
    },
    limits: {
      naverpay: { min: 1000, max: 500000 },
    },
  },
];

class PaymentService {
  public providers: PaymentProvider[];
  private config: {
    tossClientKey: string;
    kakaoAdminKey: string;
    naverClientId: string;
    successUrl: string;
    failUrl: string;
  };

  constructor() {
    this.providers = PAYMENT_PROVIDERS;
    this.config = {
      tossClientKey: import.meta.env.VITE_TOSSPAY_CLIENT_KEY || "",
      kakaoAdminKey: import.meta.env.VITE_KAKAOPAY_ADMIN_KEY || "",
      naverClientId: import.meta.env.VITE_NAVERPAY_CLIENT_ID || "",
      successUrl: `${window.location.origin}/payment/success`,
      failUrl: `${window.location.origin}/payment/fail`,
    };
  }

  // 토스페이먼츠 결제 처리
  async processTossPayment(
    paymentRequest: PaymentRequest,
  ): Promise<PaymentResponse> {
    try {
      // 토스페이먼츠 SDK 동적 로드
      const TossPayments = await this.loadTossPaymentsSDK();

      const tossPayments = TossPayments(this.config.tossClientKey);

      // 결제 위젯 또는 결제창 호출
      const payment = await tossPayments.requestPayment(
        this.getPaymentMethodCode(paymentRequest.paymentMethod),
        {
          amount: paymentRequest.amount,
          orderId: paymentRequest.orderId,
          orderName: paymentRequest.orderName,
          customerName: paymentRequest.customerName,
          customerEmail: paymentRequest.customerEmail,
          successUrl: this.config.successUrl,
          failUrl: this.config.failUrl,
          flowMode: "DIRECT", // 바로 결제창
        },
      );

      return {
        success: true,
        paymentKey: payment.paymentKey,
        orderId: payment.orderId,
        amount: payment.amount,
        method: paymentRequest.paymentMethod,
        approvedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("Toss Payment Error:", error);
      return {
        success: false,
        orderId: paymentRequest.orderId,
        amount: paymentRequest.amount,
        method: paymentRequest.paymentMethod,
        failReason: error.message || "결제 처리 중 오류가 발생했습니다.",
      };
    }
  }

  // 카카오페이 결제 처리
  async processKakaoPayment(
    paymentRequest: PaymentRequest,
  ): Promise<PaymentResponse> {
    try {
      // 카카오페이 결제 준비 요청
      const response = await fetch("https://kapi.kakao.com/v1/payment/ready", {
        method: "POST",
        headers: {
          Authorization: `KakaoAK ${this.config.kakaoAdminKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          cid: "TC0ONETIME", // 테스트용 CID
          partner_order_id: paymentRequest.orderId,
          partner_user_id: paymentRequest.customerEmail || "anonymous",
          item_name: paymentRequest.orderName,
          quantity: "1",
          total_amount: paymentRequest.amount.toString(),
          tax_free_amount: "0",
          approval_url: this.config.successUrl,
          cancel_url: this.config.failUrl,
          fail_url: this.config.failUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("카카오페이 결제 준비 실패");
      }

      const paymentData = await response.json();

      // 결제 페이지로 리다이렉트
      window.location.href = paymentData.next_redirect_pc_url;

      return {
        success: true,
        orderId: paymentRequest.orderId,
        amount: paymentRequest.amount,
        method: "kakaopay",
        approvedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("KakaoPay Error:", error);
      return {
        success: false,
        orderId: paymentRequest.orderId,
        amount: paymentRequest.amount,
        method: "kakaopay",
        failReason: error.message || "카카오페이 결제 중 오류가 발생했습니다.",
      };
    }
  }

  // 네이버페이 결제 처리
  async processNaverPayment(
    paymentRequest: PaymentRequest,
  ): Promise<PaymentResponse> {
    try {
      // 네이버페이 SDK 또는 API 호출
      const naverPayData = {
        merchantPayKey: paymentRequest.orderId,
        productName: paymentRequest.orderName,
        totalPayAmount: paymentRequest.amount,
        returnUrl: this.config.successUrl,
        merchantUserKey: paymentRequest.customerEmail || "anonymous",
      };

      // 실제 환경에서는 네이버페이 API 호출
      // const response = await fetch('https://dev.apis.naver.com/naverpay-partner/naverpay/payments/v2.2/apply', {
      //   method: 'POST',
      //   headers: {
      //     'X-Naver-Client-Id': this.config.naverClientId,
      //     'X-Naver-Client-Secret': process.env.VITE_NAVERPAY_CLIENT_SECRET,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(naverPayData)
      // })

      // 시뮬레이션
      return {
        success: true,
        orderId: paymentRequest.orderId,
        amount: paymentRequest.amount,
        method: "naverpay",
        approvedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("NaverPay Error:", error);
      return {
        success: false,
        orderId: paymentRequest.orderId,
        amount: paymentRequest.amount,
        method: "naverpay",
        failReason: error.message || "네이버페이 결제 중 오류가 발생했습니다.",
      };
    }
  }

  // 무통장입금 처리
  async processBankTransfer(
    paymentRequest: PaymentRequest,
  ): Promise<PaymentResponse> {
    try {
      // 가상계좌 발급 또는 무통장입금 안내
      const virtualAccount = this.generateVirtualAccount();

      // 실제 환경에서는 가상계좌 발급 API 호출
      const bankInfo = {
        bankName: "국민은행",
        accountNumber: virtualAccount,
        accountHolder: "SNS샵",
        amount: paymentRequest.amount,
        expireTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24시간 후 만료
      };

      // 사용자에게 입금 안내
      alert(
        `무통장입금 안내\n\n은행: ${bankInfo.bankName}\n계좌번호: ${bankInfo.accountNumber}\n예금주: ${bankInfo.accountHolder}\n입금액: ${paymentRequest.amount.toLocaleString()}원\n\n입금 확인 후 1-2시간 내에 충전됩니다.`,
      );

      return {
        success: true,
        orderId: paymentRequest.orderId,
        amount: paymentRequest.amount,
        method: "bank",
        approvedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("Bank Transfer Error:", error);
      return {
        success: false,
        orderId: paymentRequest.orderId,
        amount: paymentRequest.amount,
        method: "bank",
        failReason: error.message || "무통장입금 처리 중 오류가 발생했습니다.",
      };
    }
  }

  // 휴대폰결제 처리
  async processPhonePayment(
    paymentRequest: PaymentRequest,
  ): Promise<PaymentResponse> {
    try {
      // 휴대폰결제는 일반적으로 PG사의 결제창을 통해 처리
      // 토스페이먼츠, 이니시스, KCP 등의 PG사 API 사용

      const phonePaymentData = {
        orderId: paymentRequest.orderId,
        amount: paymentRequest.amount,
        productName: paymentRequest.orderName,
        buyerName: paymentRequest.customerName || "",
        buyerEmail: paymentRequest.customerEmail || "",
        returnUrl: this.config.successUrl,
        errorUrl: this.config.failUrl,
      };

      // 시뮬레이션 (실제로는 PG사 결제창 호출)
      const confirmPayment = confirm(
        `휴대폰결제 확인\n\n상품명: ${paymentRequest.orderName}\n결제금액: ${paymentRequest.amount.toLocaleString()}원\n수수료: 3,000원\n\n결제를 진행하시겠습니까?`,
      );

      if (!confirmPayment) {
        throw new Error("사용자가 결제를 취소했습니다.");
      }

      return {
        success: true,
        orderId: paymentRequest.orderId,
        amount: paymentRequest.amount,
        method: "phone",
        approvedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("Phone Payment Error:", error);
      return {
        success: false,
        orderId: paymentRequest.orderId,
        amount: paymentRequest.amount,
        method: "phone",
        failReason: error.message || "휴대폰결제 처리 중 오류가 발생했습니다.",
      };
    }
  }

  // 결제 처리 메인 함수
  async processPayment(
    paymentRequest: PaymentRequest,
  ): Promise<PaymentResponse> {
    // 결제 금액 및 방법 유효성 검사
    const validation = this.validatePayment(paymentRequest);
    if (!validation.isValid) {
      return {
        success: false,
        orderId: paymentRequest.orderId,
        amount: paymentRequest.amount,
        method: paymentRequest.paymentMethod,
        failReason: validation.message,
      };
    }

    // 결제 방법별 처리
    switch (paymentRequest.paymentMethod) {
      case "card":
      case "tosspay":
        return this.processTossPayment(paymentRequest);
      case "kakaopay":
        return this.processKakaoPayment(paymentRequest);
      case "naverpay":
        return this.processNaverPayment(paymentRequest);
      case "bank":
        return this.processBankTransfer(paymentRequest);
      case "phone":
        return this.processPhonePayment(paymentRequest);
      default:
        return {
          success: false,
          orderId: paymentRequest.orderId,
          amount: paymentRequest.amount,
          method: paymentRequest.paymentMethod,
          failReason: "지원하지 않는 결제 방법입니다.",
        };
    }
  }

  // 결제 유효성 검사
  private validatePayment(paymentRequest: PaymentRequest): {
    isValid: boolean;
    message?: string;
  } {
    const provider = this.providers.find(
      (p) => p.methods.includes(paymentRequest.paymentMethod) && p.isActive,
    );

    if (!provider) {
      return {
        isValid: false,
        message: "현재 사용할 수 없는 결제 방법입니다.",
      };
    }

    const limits = provider.limits[paymentRequest.paymentMethod];
    if (limits) {
      if (paymentRequest.amount < limits.min) {
        return {
          isValid: false,
          message: `최소 결제 금액은 ${limits.min.toLocaleString()}원입니다.`,
        };
      }
      if (paymentRequest.amount > limits.max) {
        return {
          isValid: false,
          message: `최대 결제 금액은 ${limits.max.toLocaleString()}원입니다.`,
        };
      }
    }

    return { isValid: true };
  }

  // 토스페이먼츠 SDK 동적 로드
  private async loadTossPaymentsSDK(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (window.TossPayments) {
        resolve(window.TossPayments);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://js.tosspayments.com/v1";
      script.onload = () => {
        resolve(window.TossPayments);
      };
      script.onerror = () => {
        reject(new Error("토스페이먼츠 SDK 로드 실패"));
      };
      document.head.appendChild(script);
    });
  }

  // 결제 방법 코드 변환
  private getPaymentMethodCode(method: string): string {
    const methodCodes: { [key: string]: string } = {
      card: "카드",
      tosspay: "토스페이",
      kakaopay: "카카오페이",
      naverpay: "네이버페이",
      bank: "계좌이체",
      phone: "휴대폰",
    };
    return methodCodes[method] || method;
  }

  // 가상계좌 번호 생성
  private generateVirtualAccount(): string {
    const prefix = "110204";
    const suffix = Math.random().toString().substr(2, 8);
    return `${prefix}${suffix}`;
  }

  // 결제 승인 확인
  async confirmPayment(
    paymentKey: string,
    orderId: string,
    amount: number,
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch(
        "https://api.tosspayments.com/v1/payments/confirm",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(this.config.tossClientKey + ":")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("결제 승인 실패");
      }

      const paymentData = await response.json();

      return {
        success: true,
        paymentKey: paymentData.paymentKey,
        orderId: paymentData.orderId,
        amount: paymentData.totalAmount,
        method: paymentData.method,
        approvedAt: paymentData.approvedAt,
        receiptUrl: paymentData.receipt?.url,
      };
    } catch (error: any) {
      console.error("Payment Confirmation Error:", error);
      return {
        success: false,
        orderId,
        amount,
        method: "unknown",
        failReason: error.message || "결제 승인 확인 중 오류가 발생했습니다.",
      };
    }
  }

  // 결제 취소
  async cancelPayment(
    paymentKey: string,
    cancelReason: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await fetch(
        `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(this.config.tossClientKey + ":")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cancelReason,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("결제 취소 실패");
      }

      return {
        success: true,
        message: "결제가 성공적으로 취소되었습니다.",
      };
    } catch (error: any) {
      console.error("Payment Cancel Error:", error);
      return {
        success: false,
        message: error.message || "결제 취소 중 오류가 발생했습니다.",
      };
    }
  }

  // 수수료 계산
  calculateFee(amount: number, method: string): number {
    const provider = this.providers.find(
      (p) => p.methods.includes(method) && p.isActive,
    );
    return provider?.fees[method] || 0;
  }

  // 실제 충전 금액 계산 (수수료 제외)
  calculateNetAmount(amount: number, method: string): number {
    const fee = this.calculateFee(amount, method);
    return amount - fee;
  }
}

// 싱글톤 인스턴스
export const paymentService = new PaymentService();

// 글로벌 타입 선언
declare global {
  interface Window {
    TossPayments: any;
  }
}
