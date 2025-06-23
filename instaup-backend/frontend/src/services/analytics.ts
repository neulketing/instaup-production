// 사용자 행동 분석 서비스 (Google Analytics + Mixpanel)

export interface AnalyticsEvent {
  name: string;
  properties?: { [key: string]: any };
  userId?: string;
  timestamp?: string;
}

export interface UserProperties {
  userId: string;
  email?: string;
  plan?: string;
  registrationDate?: string;
  totalOrders?: number;
  totalSpent?: number;
  lastLoginDate?: string;
}

class AnalyticsService {
  private gaInitialized = false;
  private mixpanelInitialized = false;
  private config = {
    gaId: import.meta.env.VITE_GA_MEASUREMENT_ID || "",
    mixpanelToken: import.meta.env.VITE_MIXPANEL_TOKEN || "",
    debug: import.meta.env.VITE_DEBUG_MODE === "true",
  };

  constructor() {
    this.initialize();
  }

  // 분석 도구 초기화
  private async initialize() {
    try {
      await Promise.all([
        this.initializeGoogleAnalytics(),
        this.initializeMixpanel(),
      ]);
    } catch (error) {
      console.error("Analytics initialization error:", error);
    }
  }

  // Google Analytics 4 초기화
  private async initializeGoogleAnalytics(): Promise<void> {
    if (!this.config.gaId || this.gaInitialized) return;

    try {
      // gtag 스크립트 동적 로드
      const script1 = document.createElement("script");
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gaId}`;
      document.head.appendChild(script1);

      // gtag 함수 초기화
      const script2 = document.createElement("script");
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${this.config.gaId}', {
          send_page_view: true,
          anonymize_ip: true,
          allow_google_signals: true,
          enhanced_measurement: true
        });
      `;
      document.head.appendChild(script2);

      // 글로벌 gtag 함수 설정
      window.dataLayer = window.dataLayer || [];
      window.gtag = () => {
        window.dataLayer.push(arguments);
      };

      this.gaInitialized = true;

      if (this.config.debug) {
        console.log("✅ Google Analytics 4 initialized");
      }
    } catch (error) {
      console.error("Google Analytics initialization failed:", error);
    }
  }

  // Mixpanel 초기화
  private async initializeMixpanel(): Promise<void> {
    if (!this.config.mixpanelToken || this.mixpanelInitialized) return;

    try {
      // Mixpanel 스크립트 동적 로드
      const script = document.createElement("script");
      script.innerHTML = `
        (function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");e.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===c.location.protocol&&"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);

        mixpanel.init('${this.config.mixpanelToken}', {
          debug: ${this.config.debug},
          track_pageview: true,
          persistence: 'localStorage',
          property_blacklist: ['$current_url', '$initial_referrer', '$referrer'],
          ignore_dnt: true,
          secure_cookie: true,
          cross_site_cookie: true,
          autotrack: {
            clicks: true,
            scroll: true,
            forms: true
          }
        });
      `;
      document.head.appendChild(script);

      this.mixpanelInitialized = true;

      if (this.config.debug) {
        console.log("✅ Mixpanel initialized");
      }
    } catch (error) {
      console.error("Mixpanel initialization failed:", error);
    }
  }

  // 이벤트 추적
  track(event: AnalyticsEvent): void {
    try {
      const eventData = {
        ...event.properties,
        timestamp: event.timestamp || new Date().toISOString(),
        page_url: window.location.href,
        page_title: document.title,
        user_agent: navigator.userAgent,
        platform: "web",
      };

      // Google Analytics 4 이벤트
      if (this.gaInitialized && window.gtag) {
        window.gtag("event", event.name, {
          ...eventData,
          user_id: event.userId,
          send_to: this.config.gaId,
        });
      }

      // Mixpanel 이벤트
      if (this.mixpanelInitialized && window.mixpanel) {
        window.mixpanel.track(event.name, eventData);
      }

      if (this.config.debug) {
        console.log("📊 Event tracked:", event.name, eventData);
      }
    } catch (error) {
      console.error("Event tracking failed:", error);
    }
  }

  // 사용자 식별
  identify(userId: string, properties?: UserProperties): void {
    try {
      // Google Analytics 사용자 ID 설정
      if (this.gaInitialized && window.gtag) {
        window.gtag("config", this.config.gaId, {
          user_id: userId,
        });
      }

      // Mixpanel 사용자 식별
      if (this.mixpanelInitialized && window.mixpanel) {
        window.mixpanel.identify(userId);

        if (properties) {
          window.mixpanel.people.set({
            $email: properties.email,
            $created: properties.registrationDate,
            plan: properties.plan,
            total_orders: properties.totalOrders,
            total_spent: properties.totalSpent,
            last_login: properties.lastLoginDate,
          });
        }
      }

      if (this.config.debug) {
        console.log("👤 User identified:", userId, properties);
      }
    } catch (error) {
      console.error("User identification failed:", error);
    }
  }

  // 페이지 뷰 추적
  trackPageView(page?: string, title?: string): void {
    try {
      const currentPage = page || window.location.pathname;
      const currentTitle = title || document.title;

      // Google Analytics 페이지 뷰
      if (this.gaInitialized && window.gtag) {
        window.gtag("config", this.config.gaId, {
          page_title: currentTitle,
          page_location: window.location.href,
        });
      }

      // Mixpanel 페이지 뷰
      if (this.mixpanelInitialized && window.mixpanel) {
        window.mixpanel.track("Page View", {
          page: currentPage,
          title: currentTitle,
          url: window.location.href,
          referrer: document.referrer,
        });
      }

      if (this.config.debug) {
        console.log("📄 Page view tracked:", currentPage);
      }
    } catch (error) {
      console.error("Page view tracking failed:", error);
    }
  }

  // 커스텀 비즈니스 이벤트들
  trackSignup(method: string, userId: string): void {
    this.track({
      name: "sign_up",
      properties: {
        method,
        category: "authentication",
      },
      userId,
    });
  }

  trackLogin(method: string, userId: string): void {
    this.track({
      name: "login",
      properties: {
        method,
        category: "authentication",
      },
      userId,
    });
  }

  trackPurchase(
    orderId: string,
    amount: number,
    currency: string,
    items: any[],
  ): void {
    this.track({
      name: "purchase",
      properties: {
        transaction_id: orderId,
        value: amount,
        currency,
        items,
        category: "ecommerce",
      },
    });
  }

  trackRecharge(method: string, amount: number, success: boolean): void {
    this.track({
      name: "recharge_attempt",
      properties: {
        payment_method: method,
        amount,
        success,
        currency: "KRW",
        category: "payment",
      },
    });
  }

  trackServiceOrder(
    platform: string,
    service: string,
    quantity: number,
    price: number,
  ): void {
    this.track({
      name: "service_order",
      properties: {
        platform,
        service_type: service,
        quantity,
        price,
        currency: "KRW",
        category: "order",
      },
    });
  }

  trackSearchEvent(query: string, results: number): void {
    this.track({
      name: "search",
      properties: {
        search_term: query,
        results_count: results,
        category: "engagement",
      },
    });
  }

  trackEngagement(element: string, action: string): void {
    this.track({
      name: "user_engagement",
      properties: {
        element,
        action,
        category: "interaction",
      },
    });
  }

  // 전자상거래 추적
  trackBeginCheckout(value: number, currency: string, items: any[]): void {
    this.track({
      name: "begin_checkout",
      properties: {
        value,
        currency,
        items,
        category: "ecommerce",
      },
    });
  }

  trackAddToCart(item: any): void {
    this.track({
      name: "add_to_cart",
      properties: {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        quantity: item.quantity,
        price: item.price,
        currency: "KRW",
        category: "ecommerce",
      },
    });
  }

  // 성능 메트릭 추적
  trackPerformance(metric: string, value: number): void {
    this.track({
      name: "performance_metric",
      properties: {
        metric_name: metric,
        metric_value: value,
        category: "performance",
      },
    });
  }

  // 에러 추적
  trackError(error: string, context?: string): void {
    this.track({
      name: "error_occurred",
      properties: {
        error_message: error,
        error_context: context || "unknown",
        category: "error",
      },
    });
  }

  // A/B 테스트 추적
  trackExperiment(experimentName: string, variant: string): void {
    this.track({
      name: "experiment_view",
      properties: {
        experiment_name: experimentName,
        variant,
        category: "experiment",
      },
    });
  }

  // 사용자 속성 업데이트
  setUserProperty(key: string, value: any): void {
    try {
      // Google Analytics 사용자 속성
      if (this.gaInitialized && window.gtag) {
        window.gtag("config", this.config.gaId, {
          custom_map: { [key]: value },
        });
      }

      // Mixpanel 사용자 속성
      if (this.mixpanelInitialized && window.mixpanel) {
        window.mixpanel.people.set({ [key]: value });
      }

      if (this.config.debug) {
        console.log("🏷️ User property set:", key, value);
      }
    } catch (error) {
      console.error("User property setting failed:", error);
    }
  }

  // 옵트아웃 (개인정보 보호)
  optOut(): void {
    try {
      // Google Analytics 옵트아웃
      if (this.gaInitialized && window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "denied",
        });
      }

      // Mixpanel 옵트아웃
      if (this.mixpanelInitialized && window.mixpanel) {
        window.mixpanel.opt_out_tracking();
      }

      console.log("🚫 Analytics tracking opted out");
    } catch (error) {
      console.error("Opt-out failed:", error);
    }
  }

  // 옵트인 (분석 허용)
  optIn(): void {
    try {
      // Google Analytics 옵트인
      if (this.gaInitialized && window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
        });
      }

      // Mixpanel 옵트인
      if (this.mixpanelInitialized && window.mixpanel) {
        window.mixpanel.opt_in_tracking();
      }

      console.log("✅ Analytics tracking opted in");
    } catch (error) {
      console.error("Opt-in failed:", error);
    }
  }
}

// 싱글톤 인스턴스
export const analytics = new AnalyticsService();

// 글로벌 타입 선언
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    mixpanel: any;
  }
}

// React Hook for Analytics
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    identify: analytics.identify.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackSignup: analytics.trackSignup.bind(analytics),
    trackLogin: analytics.trackLogin.bind(analytics),
    trackPurchase: analytics.trackPurchase.bind(analytics),
    trackRecharge: analytics.trackRecharge.bind(analytics),
    trackServiceOrder: analytics.trackServiceOrder.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    setUserProperty: analytics.setUserProperty.bind(analytics),
    optOut: analytics.optOut.bind(analytics),
    optIn: analytics.optIn.bind(analytics),
  };
};
