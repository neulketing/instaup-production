// 자동화 관리 컴포넌트
import { useEffect, useState } from "react";

interface AutomationTask {
  id: string;
  name: string;
  type: "order_processing" | "alert" | "backup" | "maintenance" | "report";
  status: "active" | "inactive" | "running" | "error";
  schedule: {
    type: "interval" | "cron" | "trigger";
    value: string;
    lastRun?: string;
    nextRun?: string;
  };
  config: {
    [key: string]: any;
  };
  logs: AutomationLog[];
  createdAt: string;
  updatedAt: string;
}

interface AutomationLog {
  id: string;
  taskId: string;
  startTime: string;
  endTime?: string;
  status: "running" | "success" | "error" | "cancelled";
  message: string;
  details?: any;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type:
      | "order_created"
      | "payment_received"
      | "user_registered"
      | "time_based";
    conditions: any;
  };
  actions: {
    type:
      | "send_notification"
      | "process_order"
      | "update_status"
      | "run_script";
    config: any;
  }[];
  isActive: boolean;
  executionCount: number;
  lastExecuted?: string;
}

export default function AutomationManagement() {
  const [activeTab, setActiveTab] = useState<
    "tasks" | "rules" | "logs" | "templates"
  >("tasks");
  const [tasks, setTasks] = useState<AutomationTask[]>([]);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<AutomationTask | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    name: "",
    type: "order_processing" as AutomationTask["type"],
    schedule: {
      type: "interval" as "interval" | "cron" | "trigger",
      value: "30",
    },
    config: {},
  });

  useEffect(() => {
    loadAutomationData();

    // 실시간 업데이트 (5초마다)
    const interval = setInterval(loadAutomationData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadAutomationData = async () => {
    try {
      setLoading(true);

      // 시뮬레이션 데이터 생성
      const mockTasks: AutomationTask[] = [
        {
          id: "task-1",
          name: "자동 주문 처리",
          type: "order_processing",
          status: "active",
          schedule: {
            type: "interval",
            value: "5",
            lastRun: new Date(Date.now() - 300000).toISOString(),
            nextRun: new Date(Date.now() + 300000).toISOString(),
          },
          config: {
            maxOrdersPerRun: 50,
            priorityFilter: "premium",
            autoApprove: true,
          },
          logs: [],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "task-2",
          name: "일일 백업",
          type: "backup",
          status: "active",
          schedule: {
            type: "cron",
            value: "0 2 * * *",
            lastRun: new Date(Date.now() - 3600000 * 22).toISOString(),
            nextRun: new Date(Date.now() + 3600000 * 2).toISOString(),
          },
          config: {
            includeFiles: true,
            includeDatabase: true,
            retention: 30,
          },
          logs: [],
          createdAt: new Date(Date.now() - 604800000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "task-3",
          name: "시스템 모니터링 알림",
          type: "alert",
          status: "running",
          schedule: {
            type: "interval",
            value: "1",
            lastRun: new Date(Date.now() - 60000).toISOString(),
            nextRun: new Date(Date.now() + 60000).toISOString(),
          },
          config: {
            cpuThreshold: 80,
            memoryThreshold: 85,
            diskThreshold: 90,
            responseTimeThreshold: 5000,
          },
          logs: [],
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const mockRules: AutomationRule[] = [
        {
          id: "rule-1",
          name: "신규 주문 자동 승인",
          description: "프리미엄 고객의 주문을 자동으로 승인합니다.",
          trigger: {
            type: "order_created",
            conditions: {
              userTier: "premium",
              orderAmount: { min: 0, max: 100000 },
            },
          },
          actions: [
            {
              type: "update_status",
              config: { status: "approved" },
            },
            {
              type: "send_notification",
              config: {
                template: "order_approved",
                recipients: ["customer", "admin"],
              },
            },
          ],
          isActive: true,
          executionCount: 247,
          lastExecuted: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: "rule-2",
          name: "결제 완료 처리",
          description: "결제 확인 시 주문을 자동으로 처리 상태로 변경합니다.",
          trigger: {
            type: "payment_received",
            conditions: {
              paymentStatus: "completed",
            },
          },
          actions: [
            {
              type: "update_status",
              config: { status: "processing" },
            },
            {
              type: "run_script",
              config: { script: "start_fulfillment.py" },
            },
          ],
          isActive: true,
          executionCount: 1024,
          lastExecuted: new Date(Date.now() - 900000).toISOString(),
        },
      ];

      const mockLogs: AutomationLog[] = [
        {
          id: "log-1",
          taskId: "task-1",
          startTime: new Date(Date.now() - 300000).toISOString(),
          endTime: new Date(Date.now() - 299000).toISOString(),
          status: "success",
          message: "45개 주문 자동 처리 완료",
          details: { processedOrders: 45, errors: 0 },
        },
        {
          id: "log-2",
          taskId: "task-3",
          startTime: new Date(Date.now() - 60000).toISOString(),
          endTime: new Date(Date.now() - 59000).toISOString(),
          status: "success",
          message: "시스템 상태 정상",
          details: { cpu: 45, memory: 62, disk: 73, responseTime: 234 },
        },
        {
          id: "log-3",
          taskId: "task-2",
          startTime: new Date(Date.now() - 3600000 * 22).toISOString(),
          endTime: new Date(Date.now() - 3600000 * 22 + 180000).toISOString(),
          status: "success",
          message: "백업 완료 (2.3GB)",
          details: { fileSize: "2.3GB", duration: "3분" },
        },
      ];

      setTasks(mockTasks);
      setRules(mockRules);
      setLogs(mockLogs);
    } catch (error) {
      console.error("자동화 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "active" ? "inactive" : "active",
            }
          : task,
      ),
    );
  };

  const runTaskNow = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "running",
              schedule: {
                ...task.schedule,
                lastRun: new Date().toISOString(),
              },
            }
          : task,
      ),
    );

    // 5초 후 완료 상태로 변경
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: "active" } : task,
        ),
      );
    }, 5000);
  };

  const createTask = () => {
    const newTask: AutomationTask = {
      id: `task-${Date.now()}`,
      name: newTaskForm.name,
      type: newTaskForm.type,
      status: "inactive",
      schedule: {
        ...newTaskForm.schedule,
        nextRun: new Date(Date.now() + 60000).toISOString(),
      },
      config: newTaskForm.config,
      logs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((prev) => [...prev, newTask]);
    setShowCreateModal(false);
    setNewTaskForm({
      name: "",
      type: "order_processing",
      schedule: { type: "interval", value: "30" },
      config: {},
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "inactive":
        return "text-gray-600 bg-gray-100";
      case "running":
        return "text-blue-600 bg-blue-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "order_processing":
        return "📦";
      case "alert":
        return "🚨";
      case "backup":
        return "💾";
      case "maintenance":
        return "🔧";
      case "report":
        return "📊";
      default:
        return "⚙️";
    }
  };

  const formatSchedule = (schedule: AutomationTask["schedule"]) => {
    if (schedule.type === "interval") {
      return `매 ${schedule.value}분`;
    } else if (schedule.type === "cron") {
      return `크론: ${schedule.value}`;
    }
    return "트리거 기반";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: "tasks", name: "자동화 작업", icon: "⚙️" },
            { id: "rules", name: "자동화 규칙", icon: "📋" },
            { id: "logs", name: "실행 로그", icon: "📝" },
            { id: "templates", name: "템플릿", icon: "📄" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* 자동화 작업 탭 */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">자동화 작업</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + 새 작업 생성
            </button>
          </div>

          <div className="grid gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {getTaskTypeIcon(task.type)}
                    </span>
                    <div>
                      <h3 className="font-semibold">{task.name}</h3>
                      <p className="text-sm text-gray-600">
                        {formatSchedule(task.schedule)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </span>
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        task.status === "active"
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                    >
                      {task.status === "active" ? "정지" : "시작"}
                    </button>
                    <button
                      onClick={() => runTaskNow(task.id)}
                      disabled={task.status === "running"}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 disabled:opacity-50"
                    >
                      지금 실행
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">마지막 실행:</span>
                    <div className="font-medium">
                      {task.schedule.lastRun
                        ? new Date(task.schedule.lastRun).toLocaleString()
                        : "실행 기록 없음"}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">다음 실행:</span>
                    <div className="font-medium">
                      {task.schedule.nextRun
                        ? new Date(task.schedule.nextRun).toLocaleString()
                        : "예정 없음"}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">생성일:</span>
                    <div className="font-medium">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {task.status === "running" && (
                  <div className="mt-4 flex items-center space-x-2 text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>실행 중...</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 자동화 규칙 탭 */}
      {activeTab === "rules" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">자동화 규칙</h2>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              + 새 규칙 생성
            </button>
          </div>

          <div className="grid gap-4">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{rule.name}</h3>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rule.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {rule.isActive ? "활성" : "비활성"}
                    </span>
                    <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200">
                      편집
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">트리거:</span>
                    <div className="font-medium">{rule.trigger.type}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">실행 횟수:</span>
                    <div className="font-medium">
                      {rule.executionCount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">마지막 실행:</span>
                    <div className="font-medium">
                      {rule.lastExecuted
                        ? new Date(rule.lastExecuted).toLocaleString()
                        : "실행 기록 없음"}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-gray-500 text-sm">액션:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {rule.actions.map((action, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {action.type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 실행 로그 탭 */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">실행 로그</h2>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      시작 시간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      소요 시간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      메시지
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => {
                    const task = tasks.find((t) => t.id === log.taskId);
                    const duration = log.endTime
                      ? Math.round(
                          (new Date(log.endTime).getTime() -
                            new Date(log.startTime).getTime()) /
                            1000,
                        )
                      : null;

                    return (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="mr-2">
                              {getTaskTypeIcon(task?.type || "")}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {task?.name || "알 수 없는 작업"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(log.startTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {duration ? `${duration}초` : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {log.message}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 템플릿 탭 */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">자동화 템플릿</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "주문 자동 처리",
                description: "신규 주문을 자동으로 검토하고 승인합니다.",
                icon: "📦",
                category: "주문 관리",
              },
              {
                name: "일일 백업",
                description: "매일 자동으로 데이터베이스와 파일을 백업합니다.",
                icon: "💾",
                category: "시스템",
              },
              {
                name: "성능 모니터링",
                description:
                  "시스템 성능을 모니터링하고 이상 시 알림을 보냅니다.",
                icon: "📈",
                category: "모니터링",
              },
              {
                name: "사용자 알림",
                description:
                  "특정 이벤트 발생 시 사용자에게 알림을 발송합니다.",
                icon: "🔔",
                category: "알림",
              },
              {
                name: "보고서 생성",
                description: "주기적으로 분석 보고서를 생성하고 전송합니다.",
                icon: "📊",
                category: "보고서",
              },
              {
                name: "데이터 정리",
                description: "오래된 로그와 임시 파일을 자동으로 정리합니다.",
                icon: "🧹",
                category: "유지보수",
              },
            ].map((template, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{template.icon}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {template.category}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {template.description}
                </p>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                  템플릿 사용
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 작업 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4">새 자동화 작업 생성</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  작업 이름
                </label>
                <input
                  type="text"
                  value={newTaskForm.name}
                  onChange={(e) =>
                    setNewTaskForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="작업 이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  작업 유형
                </label>
                <select
                  value={newTaskForm.type}
                  onChange={(e) =>
                    setNewTaskForm((prev) => ({
                      ...prev,
                      type: e.target.value as AutomationTask["type"],
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="order_processing">주문 처리</option>
                  <option value="alert">알림</option>
                  <option value="backup">백업</option>
                  <option value="maintenance">유지보수</option>
                  <option value="report">보고서</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  실행 주기
                </label>
                <div className="flex space-x-2">
                  <select
                    value={newTaskForm.schedule.type}
                    onChange={(e) =>
                      setNewTaskForm((prev) => ({
                        ...prev,
                        schedule: {
                          ...prev.schedule,
                          type: e.target.value as
                            | "interval"
                            | "cron"
                            | "trigger",
                        },
                      }))
                    }
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="interval">간격</option>
                    <option value="cron">크론</option>
                    <option value="trigger">트리거</option>
                  </select>
                  <input
                    type="text"
                    value={newTaskForm.schedule.value}
                    onChange={(e) =>
                      setNewTaskForm((prev) => ({
                        ...prev,
                        schedule: { ...prev.schedule, value: e.target.value },
                      }))
                    }
                    className="flex-1 px-3 py-2 border rounded-md"
                    placeholder={
                      newTaskForm.schedule.type === "interval"
                        ? "분"
                        : "cron 표현식"
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={createTask}
                disabled={!newTaskForm.name}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
