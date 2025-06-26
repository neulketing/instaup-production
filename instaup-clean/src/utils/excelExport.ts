import type { OrderItem } from "../types/orders";

export interface ExcelExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: "iso" | "korean";
  statusTranslation?: boolean;
}

export function exportOrdersToExcel(
  orders: OrderItem[],
  options: ExcelExportOptions = {},
) {
  const {
    filename = `주문내역_${new Date().toISOString().split("T")[0]}.csv`,
    includeHeaders = true,
    dateFormat = "korean",
    statusTranslation = true,
  } = options;

  // 상태 번역 함수
  const translateStatus = (status: string) => {
    if (!statusTranslation) return status;

    const statusMap: { [key: string]: string } = {
      pending: "대기중",
      processing: "처리중",
      in_progress: "진행중",
      completed: "완료",
      cancelled: "취소됨",
      refunded: "환불됨",
      paused: "일시정지",
      partially_completed: "부분완료",
    };
    return statusMap[status] || status;
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (dateFormat === "korean") {
      return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
    return dateString;
  };

  // CSV 헤더
  const headers = [
    "주문번호",
    "서비스명",
    "플랫폼",
    "대상 URL",
    "주문수량",
    "완료수량",
    "단가(100개당)",
    "총 가격",
    "할인율(%)",
    "최종 가격",
    "상태",
    "품질등급",
    "진행률(%)",
    "주문일시",
    "시작일시",
    "완료일시",
    "예상완료시간",
    "리필보장(일)",
    "서비스특징",
    "비고",
  ];

  // 데이터 변환
  const csvData = orders.map((order) => [
    order.id,
    order.serviceName,
    order.platform,
    order.targetUrl,
    order.quantity.toString(),
    order.completedQuantity.toString(),
    order.unitPrice.toString(),
    order.totalPrice.toString(),
    order.discountRate.toString(),
    order.finalPrice.toString(),
    translateStatus(order.status),
    order.quality.toUpperCase(),
    order.progressPercentage.toString(),
    formatDate(order.createdAt),
    order.startedAt ? formatDate(order.startedAt) : "",
    order.completedAt ? formatDate(order.completedAt) : "",
    order.estimatedCompletionTime,
    order.refillGuarantee.toString(),
    order.features.join(", "),
    order.notes || "",
  ]);

  // CSV 생성
  const csvContent = [...(includeHeaders ? [headers] : []), ...csvData]
    .map((row) =>
      row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  // BOM 추가 (한글 깨짐 방지)
  const BOM = "\uFEFF";
  const finalContent = BOM + csvContent;

  // 파일 다운로드
  const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// 주문 통계 엑셀 내보내기
export function exportOrderStatsToExcel(
  stats: Record<string, unknown>,
  orders: OrderItem[],
  options: ExcelExportOptions = {},
) {
  const filename =
    options.filename ||
    `주문통계_${new Date().toISOString().split("T")[0]}.csv`;

  const headers = ["항목", "값", "단위"];
  const statsData = [
    ["총 주문 수", stats.totalOrders.toString(), "건"],
    ["대기중 주문", stats.pendingOrders.toString(), "건"],
    ["처리중 주문", stats.processingOrders.toString(), "건"],
    ["완료된 주문", stats.completedOrders.toString(), "건"],
    ["총 지출 금액", stats.totalSpent.toLocaleString(), "원"],
    ["총 받은 수량", stats.totalReceived.toLocaleString(), "개"],
    ["완료율", `${stats.completionRate.toFixed(1)}`, "%"],
    ["평균 완료 시간", stats.averageCompletionTime.toString(), "분"],
  ];

  // 월별 주문 통계 추가
  const monthlyStats = getMonthlyOrderStats(orders);
  const monthlyData = monthlyStats.map((month) => [
    `${month.month}월 주문`,
    month.count.toString(),
    "건",
  ]);

  const csvContent = [
    ["=== 주문 통계 ===", "", ""],
    ...statsData,
    ["", "", ""],
    ["=== 월별 주문 현황 ===", "", ""],
    ...monthlyData,
  ]
    .map((row) =>
      row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const BOM = "\uFEFF";
  const finalContent = BOM + csvContent;

  const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// 월별 주문 통계 계산
function getMonthlyOrderStats(orders: OrderItem[]) {
  const monthlyMap = new Map<number, number>();

  for (const order of orders) {
    const month = new Date(order.createdAt).getMonth() + 1;
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
  }

  return Array.from(monthlyMap.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month - b.month);
}

// 필터링된 주문 내보내기
export function exportFilteredOrders(
  orders: OrderItem[],
  filterName: string,
  options: ExcelExportOptions = {},
) {
  const filename =
    options.filename ||
    `${filterName}_주문내역_${new Date().toISOString().split("T")[0]}.csv`;
  exportOrdersToExcel(orders, { ...options, filename });
}

// JSON 형태로 내보내기 (백업용)
export function exportOrdersToJSON(orders: OrderItem[], filename?: string) {
  const exportData = {
    exportDate: new Date().toISOString(),
    totalOrders: orders.length,
    orders: orders,
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download =
    filename ||
    `주문데이터_백업_${new Date().toISOString().split("T")[0]}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
