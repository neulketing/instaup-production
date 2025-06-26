// 역할 기반 권한 관리 서비스 (RBAC)

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  actions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  permissions: string[];
  color: string;
  icon: string;
}

interface UserPermissions {
  userId: string;
  roles: string[];
  additionalPermissions: string[];
  restrictions: string[];
}

// 권한 정의
const PERMISSIONS: Permission[] = [
  {
    id: "dashboard.view",
    name: "대시보드 조회",
    description: "대시보드 메트릭 및 통계 조회",
    resource: "dashboard",
    actions: ["read"],
  },
  {
    id: "orders.view",
    name: "주문 조회",
    description: "주문 목록 및 상세 정보 조회",
    resource: "orders",
    actions: ["read"],
  },
  {
    id: "orders.manage",
    name: "주문 관리",
    description: "주문 상태 변경, 취소, 처리",
    resource: "orders",
    actions: ["read", "update", "delete"],
  },
  {
    id: "users.view",
    name: "사용자 조회",
    description: "사용자 목록 및 프로필 조회",
    resource: "users",
    actions: ["read"],
  },
  {
    id: "users.manage",
    name: "사용자 관리",
    description: "사용자 상태 변경, 잔액 조정, 정지/해제",
    resource: "users",
    actions: ["read", "update", "delete"],
  },
  {
    id: "services.view",
    name: "서비스 조회",
    description: "서비스 목록 및 설정 조회",
    resource: "services",
    actions: ["read"],
  },
  {
    id: "services.manage",
    name: "서비스 관리",
    description: "서비스 생성, 수정, 삭제, 활성화/비활성화",
    resource: "services",
    actions: ["read", "create", "update", "delete"],
  },
  {
    id: "products.view",
    name: "상품 조회",
    description: "상품 목록 및 구성 조회",
    resource: "products",
    actions: ["read"],
  },
  {
    id: "products.manage",
    name: "상품 관리",
    description: "상품 생성, 수정, 삭제, 가격 설정",
    resource: "products",
    actions: ["read", "create", "update", "delete"],
  },
  {
    id: "connections.view",
    name: "연결 상태 조회",
    description: "API 연결 상태 및 로그 조회",
    resource: "connections",
    actions: ["read"],
  },
  {
    id: "connections.manage",
    name: "연결 관리",
    description: "API 연결 설정, 테스트, 재연결",
    resource: "connections",
    actions: ["read", "update"],
  },
  {
    id: "analytics.view",
    name: "분석 조회",
    description: "상세 분석 리포트 및 통계 조회",
    resource: "analytics",
    actions: ["read"],
  },
  {
    id: "analytics.export",
    name: "데이터 내보내기",
    description: "데이터 CSV/Excel 내보내기",
    resource: "analytics",
    actions: ["read", "export"],
  },
  {
    id: "system.view",
    name: "시스템 조회",
    description: "시스템 상태 및 로그 조회",
    resource: "system",
    actions: ["read"],
  },
  {
    id: "system.manage",
    name: "시스템 관리",
    description: "시스템 설정, 알림 발송, 백업/복구",
    resource: "system",
    actions: ["read", "create", "update", "delete"],
  },
  {
    id: "automation.view",
    name: "자동화 조회",
    description: "자동화 작업 상태 조회",
    resource: "automation",
    actions: ["read"],
  },
  {
    id: "automation.manage",
    name: "자동화 관리",
    description: "자동화 작업 생성, 수정, 실행, 중지",
    resource: "automation",
    actions: ["read", "create", "update", "delete", "execute"],
  },
];

// 역할 정의
const ROLES: Role[] = [
  {
    id: "viewer",
    name: "조회자",
    description: "읽기 전용 접근 권한",
    level: 1,
    color: "bg-gray-500",
    icon: "👁️",
    permissions: [
      "dashboard.view",
      "orders.view",
      "users.view",
      "services.view",
      "products.view",
      "connections.view",
    ],
  },
  {
    id: "operator",
    name: "운영자",
    description: "기본 운영 업무 수행 권한",
    level: 2,
    color: "bg-blue-500",
    icon: "👩‍💼",
    permissions: [
      "dashboard.view",
      "orders.view",
      "orders.manage",
      "users.view",
      "services.view",
      "products.view",
      "connections.view",
    ],
  },
  {
    id: "manager",
    name: "관리자",
    description: "서비스 및 상품 관리 권한",
    level: 3,
    color: "bg-green-500",
    icon: "👨‍💼",
    permissions: [
      "dashboard.view",
      "orders.view",
      "orders.manage",
      "users.view",
      "users.manage",
      "services.view",
      "services.manage",
      "products.view",
      "products.manage",
      "connections.view",
      "connections.manage",
      "analytics.view",
      "analytics.export",
    ],
  },
  {
    id: "admin",
    name: "최고 관리자",
    description: "모든 시스템 접근 권한",
    level: 4,
    color: "bg-red-500",
    icon: "👑",
    permissions: [
      "dashboard.view",
      "orders.view",
      "orders.manage",
      "users.view",
      "users.manage",
      "services.view",
      "services.manage",
      "products.view",
      "products.manage",
      "connections.view",
      "connections.manage",
      "analytics.view",
      "analytics.export",
      "system.view",
      "system.manage",
      "automation.view",
      "automation.manage",
    ],
  },
];

class PermissionService {
  private userPermissions: Map<string, UserPermissions> = new Map();

  constructor() {
    // 기본 관리자 권한 설정
    this.setUserRole("admin", ["admin"]);
  }

  // 권한 확인
  hasPermission(userId: string, permissionId: string): boolean {
    const userPerms = this.userPermissions.get(userId);
    if (!userPerms) return false;

    // 직접 권한 확인
    if (userPerms.additionalPermissions.includes(permissionId)) {
      return true;
    }

    // 제한 권한 확인
    if (userPerms.restrictions.includes(permissionId)) {
      return false;
    }

    // 역할 기반 권한 확인
    for (const roleId of userPerms.roles) {
      const role = ROLES.find((r) => r.id === roleId);
      if (role && role.permissions.includes(permissionId)) {
        return true;
      }
    }

    return false;
  }

  // 리소스 접근 권한 확인
  hasResourceAccess(userId: string, resource: string, action: string): boolean {
    const userPerms = this.userPermissions.get(userId);
    if (!userPerms) return false;

    // 해당 리소스의 모든 권한 확인
    for (const permission of PERMISSIONS) {
      if (
        permission.resource === resource &&
        permission.actions.includes(action)
      ) {
        if (this.hasPermission(userId, permission.id)) {
          return true;
        }
      }
    }

    return false;
  }

  // 사용자 역할 설정
  setUserRole(userId: string, roles: string[]): void {
    const existing = this.userPermissions.get(userId) || {
      userId,
      roles: [],
      additionalPermissions: [],
      restrictions: [],
    };

    this.userPermissions.set(userId, {
      ...existing,
      roles,
    });
  }

  // 추가 권한 부여
  grantPermission(userId: string, permissionId: string): void {
    const existing = this.userPermissions.get(userId) || {
      userId,
      roles: [],
      additionalPermissions: [],
      restrictions: [],
    };

    if (!existing.additionalPermissions.includes(permissionId)) {
      existing.additionalPermissions.push(permissionId);
    }

    // 제한에서 제거
    const restrictionIndex = existing.restrictions.indexOf(permissionId);
    if (restrictionIndex > -1) {
      existing.restrictions.splice(restrictionIndex, 1);
    }

    this.userPermissions.set(userId, existing);
  }

  // 권한 제한
  restrictPermission(userId: string, permissionId: string): void {
    const existing = this.userPermissions.get(userId) || {
      userId,
      roles: [],
      additionalPermissions: [],
      restrictions: [],
    };

    if (!existing.restrictions.includes(permissionId)) {
      existing.restrictions.push(permissionId);
    }

    // 추가 권한에서 제거
    const permIndex = existing.additionalPermissions.indexOf(permissionId);
    if (permIndex > -1) {
      existing.additionalPermissions.splice(permIndex, 1);
    }

    this.userPermissions.set(userId, existing);
  }

  // 사용자 권한 정보 조회
  getUserPermissions(userId: string): UserPermissions | null {
    return this.userPermissions.get(userId) || null;
  }

  // 사용자 역할 정보 조회
  getUserRoles(userId: string): Role[] {
    const userPerms = this.userPermissions.get(userId);
    if (!userPerms) return [];

    return ROLES.filter((role) => userPerms.roles.includes(role.id));
  }

  // 사용자 최고 권한 레벨 조회
  getUserMaxLevel(userId: string): number {
    const roles = this.getUserRoles(userId);
    return roles.length > 0 ? Math.max(...roles.map((r) => r.level)) : 0;
  }

  // 모든 권한 목록 조회
  getAllPermissions(): Permission[] {
    return [...PERMISSIONS];
  }

  // 모든 역할 목록 조회
  getAllRoles(): Role[] {
    return [...ROLES];
  }

  // 권한별 필터링된 메뉴 반환
  getFilteredMenuItems(userId: string) {
    const menuItems = [
      {
        id: "dashboard",
        name: "대시보드",
        icon: "📊",
        permission: "dashboard.view",
      },
      {
        id: "orders",
        name: "주문 관리",
        icon: "📦",
        permission: "orders.view",
      },
      {
        id: "users",
        name: "사용자 관리",
        icon: "👥",
        permission: "users.view",
      },
      {
        id: "services",
        name: "서비스 관리",
        icon: "⚙️",
        permission: "services.view",
      },
      {
        id: "products",
        name: "상품 관리",
        icon: "📝",
        permission: "products.view",
      },
      {
        id: "connections",
        name: "연결 관리",
        icon: "🔗",
        permission: "connections.view",
      },
      {
        id: "analytics",
        name: "분석",
        icon: "📈",
        permission: "analytics.view",
      },
      {
        id: "automation",
        name: "자동화",
        icon: "🤖",
        permission: "automation.view",
      },
      {
        id: "system",
        name: "시스템",
        icon: "🛠️",
        permission: "system.view",
      },
    ];

    return menuItems.filter((item) =>
      this.hasPermission(userId, item.permission),
    );
  }

  // 권한 UI 컴포넌트 래퍼
  canRender(userId: string, permissionId: string): boolean {
    return this.hasPermission(userId, permissionId);
  }
}

// 싱글톤 인스턴스
export const permissionService = new PermissionService();

// 타입 내보내기
export type { Permission, Role, UserPermissions };
export { PERMISSIONS, ROLES };
