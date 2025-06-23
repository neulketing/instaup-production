"use client";

import Papa from "papaparse";
import { useState } from "react";
import * as XLSX from "xlsx";

interface ExportData {
  orders?: any[];
  users?: any[];
  services?: any[];
  analytics?: any[];
}

interface DataExportPanelProps {
  data: ExportData;
  onClose: () => void;
}

export default function DataExportPanel({
  data,
  onClose,
}: DataExportPanelProps) {
  const [selectedData, setSelectedData] = useState<string[]>(["orders"]);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel">("excel");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30일 전
    endDate: new Date().toISOString().split("T")[0], // 오늘
  });
  const [isExporting, setIsExporting] = useState(false);

  // 샘플 데이터 생성 (실제 환경에서는 props로 받거나 API에서 가져옴)
  const getSampleData = () => {
    const orders = [
      {
        id: "ORD001",
        userId: "USR001",
        serviceName: "Instagram 팔로워 1000명",
        quantity: 1000,
        price: 15000,
        status: "완료",
        createdAt: "2024-01-15",
        platform: "Instagram",
      },
      {
        id: "ORD002",
        userId: "USR002",
        serviceName: "TikTok 좋아요 500개",
        quantity: 500,
        price: 8000,
        status: "진행중",
        createdAt: "2024-01-16",
        platform: "TikTok",
      },
      {
        id: "ORD003",
        userId: "USR001",
        serviceName: "YouTube 구독자 200명",
        quantity: 200,
        price: 12000,
        status: "완료",
        createdAt: "2024-01-17",
        platform: "YouTube",
      },
    ];

    const users = [
      {
        id: "USR001",
        username: "user1",
        email: "user1@example.com",
        name: "김철수",
        balance: 50000,
        totalOrders: 5,
        totalSpent: 75000,
        joinDate: "2024-01-01",
        lastLogin: "2024-01-17",
      },
      {
        id: "USR002",
        username: "user2",
        email: "user2@example.com",
        name: "이영희",
        balance: 25000,
        totalOrders: 2,
        totalSpent: 23000,
        joinDate: "2024-01-05",
        lastLogin: "2024-01-16",
      },
    ];

    const services = [
      {
        id: "SRV001",
        name: "Instagram 팔로워",
        platform: "Instagram",
        category: "팔로워",
        price: 15,
        minOrder: 100,
        maxOrder: 10000,
        isActive: true,
        totalOrders: 156,
        totalRevenue: 234000,
      },
      {
        id: "SRV002",
        name: "TikTok 좋아요",
        platform: "TikTok",
        category: "좋아요",
        price: 12,
        minOrder: 50,
        maxOrder: 5000,
        isActive: true,
        totalOrders: 89,
        totalRevenue: 156000,
      },
    ];

    const analytics = [
      {
        date: "2024-01-15",
        newUsers: 12,
        totalOrders: 45,
        revenue: 678000,
        platform: "Instagram",
        conversionRate: 3.2,
      },
      {
        date: "2024-01-16",
        newUsers: 8,
        totalOrders: 32,
        revenue: 456000,
        platform: "TikTok",
        conversionRate: 2.8,
      },
    ];

    return { orders, users, services, analytics };
  };

  const handleDataTypeToggle = (dataType: string) => {
    if (selectedData.includes(dataType)) {
      setSelectedData(selectedData.filter((item) => item !== dataType));
    } else {
      setSelectedData([...selectedData, dataType]);
    }
  };

  const generateFileName = (dataType: string, format: string) => {
    const date = new Date().toISOString().split("T")[0];
    return `instaup_${dataType}_${date}.${format}`;
  };

  const exportToCSV = (data: any[], fileName: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (
    datasets: { [key: string]: any[] },
    fileName: string,
  ) => {
    const workbook = XLSX.utils.book_new();

    Object.entries(datasets).forEach(([sheetName, data]) => {
      if (data && data.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }
    });

    XLSX.writeFile(workbook, fileName);
  };

  const handleExport = async () => {
    if (selectedData.length === 0) {
      alert("내보낼 데이터를 선택해주세요.");
      return;
    }

    setIsExporting(true);

    try {
      const sampleData = getSampleData();

      // 날짜 필터링 (실제 환경에서는 서버에서 필터링)
      const filterByDate = (items: any[]) => {
        return items.filter((item) => {
          const itemDate = new Date(
            item.createdAt || item.date || item.joinDate,
          );
          const start = new Date(dateRange.startDate);
          const end = new Date(dateRange.endDate);
          return itemDate >= start && itemDate <= end;
        });
      };

      if (exportFormat === "csv") {
        // CSV로 개별 파일 내보내기
        for (const dataType of selectedData) {
          let filteredData: any[] = [];

          switch (dataType) {
            case "orders":
              filteredData = filterByDate(sampleData.orders);
              break;
            case "users":
              filteredData = sampleData.users; // 사용자는 날짜 필터링 안함
              break;
            case "services":
              filteredData = sampleData.services; // 서비스도 날짜 필터링 안함
              break;
            case "analytics":
              filteredData = filterByDate(sampleData.analytics);
              break;
          }

          if (filteredData.length > 0) {
            exportToCSV(filteredData, generateFileName(dataType, "csv"));
          }
        }
      } else {
        // Excel로 통합 파일 내보내기
        const datasets: { [key: string]: any[] } = {};

        selectedData.forEach((dataType) => {
          let filteredData: any[] = [];

          switch (dataType) {
            case "orders":
              filteredData = filterByDate(sampleData.orders);
              datasets["주문데이터"] = filteredData;
              break;
            case "users":
              filteredData = sampleData.users;
              datasets["사용자데이터"] = filteredData;
              break;
            case "services":
              filteredData = sampleData.services;
              datasets["서비스데이터"] = filteredData;
              break;
            case "analytics":
              filteredData = filterByDate(sampleData.analytics);
              datasets["분석데이터"] = filteredData;
              break;
          }
        });

        exportToExcel(datasets, generateFileName("통합데이터", "xlsx"));
      }

      // 성공 메시지
      alert(
        `데이터가 성공적으로 ${exportFormat.toUpperCase()} 형식으로 내보내졌습니다.`,
      );
    } catch (error) {
      console.error("데이터 내보내기 실패:", error);
      alert("데이터 내보내기 중 오류가 발생했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">📊</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                데이터 내보내기
              </h2>
              <p className="text-sm text-gray-600">
                CSV 또는 Excel 형식으로 데이터 다운로드
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 내보낼 데이터 선택 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📋 내보낼 데이터 선택
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  id: "orders",
                  label: "주문 데이터",
                  icon: "🛒",
                  desc: "주문 내역 및 상태 정보",
                },
                {
                  id: "users",
                  label: "사용자 데이터",
                  icon: "👥",
                  desc: "회원 정보 및 통계",
                },
                {
                  id: "services",
                  label: "서비스 데이터",
                  icon: "🛍️",
                  desc: "서비스 목록 및 설정",
                },
                {
                  id: "analytics",
                  label: "분석 데이터",
                  icon: "📈",
                  desc: "매출 및 성과 지표",
                },
              ].map((item) => (
                <label key={item.id} className="cursor-pointer">
                  <div
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedData.includes(item.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedData.includes(item.id)}
                        onChange={() => handleDataTypeToggle(item.id)}
                        className="mr-3 w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-medium text-gray-900">
                            {item.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 날짜 범위 선택 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📅 기간 설정
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작일
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료일
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 파일 형식 선택 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💾 파일 형식
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="cursor-pointer">
                <div
                  className={`p-4 border-2 rounded-lg transition-all ${
                    exportFormat === "csv"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={exportFormat === "csv"}
                      onChange={(e) => setExportFormat(e.target.value as "csv")}
                      className="mr-3 w-4 h-4 text-blue-600"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">📄</span>
                        <span className="font-medium text-gray-900">
                          CSV 파일
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        각 데이터별 개별 파일
                      </p>
                    </div>
                  </div>
                </div>
              </label>

              <label className="cursor-pointer">
                <div
                  className={`p-4 border-2 rounded-lg transition-all ${
                    exportFormat === "excel"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="excel"
                      checked={exportFormat === "excel"}
                      onChange={(e) =>
                        setExportFormat(e.target.value as "excel")
                      }
                      className="mr-3 w-4 h-4 text-blue-600"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">📊</span>
                        <span className="font-medium text-gray-900">
                          Excel 파일
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        통합 파일 (여러 시트)
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* 내보내기 정보 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">📋 내보내기 요약</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div>
                • 선택된 데이터: {selectedData.length}개 (
                {selectedData.join(", ")})
              </div>
              <div>
                • 기간: {dateRange.startDate} ~ {dateRange.endDate}
              </div>
              <div>• 파일 형식: {exportFormat.toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || selectedData.length === 0}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isExporting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                내보내는 중...
              </div>
            ) : (
              `${exportFormat.toUpperCase()}로 내보내기`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
