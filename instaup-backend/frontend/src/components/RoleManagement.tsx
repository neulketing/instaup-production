// 권한 관리 컴포넌트
import { useState } from "react";
// import { usePermissions } from "../hooks/usePermissions";
import {
  PERMISSIONS,
  type Permission,
  ROLES,
  type Role,
} from "../services/permissionService";

interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

export default function RoleManagement() {
  const {
    userRoles,
    userLevel,
    allPermissions,
    allRoles,
    setUserRole,
    grantPermission,
    restrictPermission,
  } = usePermissions();
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "permissions">(
    "users",
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // 모의 관리자 사용자 데이터
  const [adminUsers] = useState<AdminUser[]>([
    {
      id: "admin",
      username: "admin",
      name: "시스템 관리자",
      email: "admin@instaup.com",
      roles: ["admin"],
      isActive: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 365).toISOString(),
    },
    {
      id: "manager1",
      username: "manager1",
      name: "서비스 관리자",
      email: "manager1@instaup.com",
      roles: ["manager"],
      isActive: true,
      lastLogin: new Date(Date.now() - 3600000 * 2).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      id: "operator1",
      username: "operator1",
      name: "운영자",
      email: "operator1@instaup.com",
      roles: ["operator"],
      isActive: true,
      lastLogin: new Date(Date.now() - 3600000 * 8).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: "viewer1",
      username: "viewer1",
      name: "조회자",
      email: "viewer1@instaup.com",
      roles: ["viewer"],
      isActive: false,
      lastLogin: new Date(Date.now() - 86400000 * 3).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
  ]);

  const getRoleInfo = (roleId: string): Role | undefined => {
    return ROLES.find((role) => role.id === roleId);
  };

  const getUserHighestRole = (user: AdminUser): Role | undefined => {
    const userRoles = user.roles
      .map((roleId) => getRoleInfo(roleId))
      .filter(Boolean) as Role[];
    return userRoles.sort((a, b) => b.level - a.level)[0];
  };

  const getPermissionsByResource = () => {
    const resources: { [key: string]: Permission[] } = {};
    PERMISSIONS.forEach((permission) => {
      if (!resources[permission.resource]) {
        resources[permission.resource] = [];
      }
      resources[permission.resource].push(permission);
    });
    return resources;
  };

  const getRoleStats = () => {
    const stats: { [key: string]: number } = {};
    ROLES.forEach((role) => {
      stats[role.id] = adminUsers.filter((user) =>
        user.roles.includes(role.id),
      ).length;
    });
    return stats;
  };

  return (
    <div className="space-y-6">
      {/* 현재 사용자 권한 정보 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">현재 로그인 계정</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <p className="font-medium">관리자 (admin)</p>
            <p className="text-sm text-gray-600">admin@instaup.com</p>
          </div>
          <div className="flex space-x-2">
            {userRoles.map((role) => (
              <span
                key={role.id}
                className={`px-3 py-1 rounded-full text-xs font-medium ${role.color} text-white`}
              >
                {role.icon} {role.name}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500">권한 레벨: {userLevel}</div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: "users", name: "사용자 관리", icon: "👥" },
            { id: "roles", name: "역할 관리", icon: "🎭" },
            { id: "permissions", name: "권한 관리", icon: "🔐" },
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

      {/* 사용자 관리 탭 */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">관리자 사용자</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + 새 관리자 추가
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사용자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    역할
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    마지막 로그인
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adminUsers.map((user) => {
                  const highestRole = getUserHighestRole(user);

                  return (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {user.roles.map((roleId) => {
                            const role = getRoleInfo(roleId);
                            return role ? (
                              <span
                                key={roleId}
                                className={`px-2 py-1 rounded-full text-xs font-medium ${role.color} text-white`}
                              >
                                {role.icon} {role.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "활성" : "비활성"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(user.lastLogin).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowPermissionModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          권한 수정
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 역할 관리 탭 */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">시스템 역할</h3>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              + 새 역할 생성
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROLES.map((role) => {
              const userCount = getRoleStats()[role.id] || 0;

              return (
                <div
                  key={role.id}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{role.icon}</span>
                      <div>
                        <h4 className="font-semibold">{role.name}</h4>
                        <p className="text-xs text-gray-500">
                          레벨 {role.level}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">{userCount}명</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {role.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">권한 수</span>
                      <span className="font-medium">
                        {role.permissions.length}개
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${role.color}`}
                        style={{
                          width: `${(role.permissions.length / PERMISSIONS.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button className="w-full mt-4 px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                    권한 상세보기
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 권한 관리 탭 */}
      {activeTab === "permissions" && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">시스템 권한</h3>

          <div className="space-y-6">
            {Object.entries(getPermissionsByResource()).map(
              ([resource, permissions]) => (
                <div
                  key={resource}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <h4 className="font-semibold mb-4 text-lg capitalize">
                    {resource === "dashboard" && "📊"}
                    {resource === "orders" && "📦"}
                    {resource === "users" && "👥"}
                    {resource === "services" && "⚙️"}
                    {resource === "products" && "📝"}
                    {resource === "connections" && "🔗"}
                    {resource === "analytics" && "📈"}
                    {resource === "automation" && "🤖"}
                    {resource === "system" && "🛠️"} {resource} 권한
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">{permission.name}</h5>
                          <div className="flex space-x-1">
                            {permission.actions.map((action) => (
                              <span
                                key={action}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                              >
                                {action}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {permission.description}
                        </p>

                        <div className="text-xs text-gray-500">
                          사용 역할:{" "}
                          {ROLES.filter((role) =>
                            role.permissions.includes(permission.id),
                          )
                            .map((role) => role.name)
                            .join(", ") || "없음"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* 권한 수정 모달 */}
      {showPermissionModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {selectedUser.name} 권한 관리
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  역할
                </label>
                <div className="space-y-2">
                  {ROLES.map((role) => (
                    <label key={role.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUser.roles.includes(role.id)}
                        onChange={(e) => {
                          // 여기서는 시뮬레이션만
                          console.log(
                            "Role change:",
                            role.id,
                            e.target.checked,
                          );
                        }}
                        className="mr-2"
                      />
                      <span
                        className={`px-2 py-1 rounded text-xs text-white mr-2 ${role.color}`}
                      >
                        {role.icon} {role.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {role.description}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
