import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardMetrics = async () => {
  try {
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();

    const revenueData = await prisma.order.aggregate({
      _sum: {
        charge: true,
      },
      where: {
        OR: [
          { status: OrderStatus.COMPLETED },
          { status: OrderStatus.PARTIAL },
        ],
      },
    });
    const totalRevenue = revenueData._sum.charge || 0;

    // 추가 대시보드 메트릭스
    const pendingOrders = await prisma.order.count({
      where: { status: OrderStatus.PENDING }
    });

    const completedOrders = await prisma.order.count({
      where: { status: OrderStatus.COMPLETED }
    });

    // 오늘과 어제 매출 비교
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayRevenue = await prisma.order.aggregate({
      _sum: { charge: true },
      where: {
        createdAt: { gte: today },
        OR: [
          { status: OrderStatus.COMPLETED },
          { status: OrderStatus.PARTIAL },
        ],
      },
    });

    const yesterdayRevenue = await prisma.order.aggregate({
      _sum: { charge: true },
      where: {
        createdAt: {
          gte: yesterday,
          lt: today
        },
        OR: [
          { status: OrderStatus.COMPLETED },
          { status: OrderStatus.PARTIAL },
        ],
      },
    });

    const todayAmount = todayRevenue._sum.charge || 0;
    const yesterdayAmount = yesterdayRevenue._sum.charge || 0;
    const dailyGrowth = yesterdayAmount > 0 ? ((todayAmount - yesterdayAmount) / yesterdayAmount) * 100 : 0;

    // 최근 활동
    const recentActivity = [
      {
        type: 'system',
        description: '대시보드 메트릭스가 업데이트되었습니다',
        timestamp: new Date().toISOString(),
      },
      {
        type: 'order',
        description: `오늘 ${await prisma.order.count({ where: { createdAt: { gte: today } } })}개의 새 주문이 생성되었습니다`,
        timestamp: new Date().toISOString(),
        amount: todayAmount,
      }
    ];

    // 인기 서비스 (임시 데이터)
    const topServices = [
      {
        id: 'instagram_followers',
        name: '인스타그램 팔로워',
        orders: 150,
        revenue: 2500000,
      },
      {
        id: 'instagram_likes',
        name: '인스타그램 좋아요',
        orders: 89,
        revenue: 890000,
      },
      {
        id: 'youtube_views',
        name: '유튜브 조회수',
        orders: 45,
        revenue: 450000,
      }
    ];

    // 플랫폼별 성과 (임시 데이터)
    const platforms = {
      instagram: { orders: 250, revenue: 4200000, growth: 12.5 },
      youtube: { orders: 89, revenue: 1800000, growth: 8.3 },
      tiktok: { orders: 67, revenue: 950000, growth: 15.2 },
      facebook: { orders: 34, revenue: 680000, growth: -2.1 },
      twitter: { orders: 12, revenue: 240000, growth: 5.7 },
    };

    return {
      success: true,
      data: {
        overview: {
          totalUsers,
          totalOrders,
          totalRevenue,
          pendingOrders,
          completedOrders,
          conversionRate: totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0,
          avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        },
        platforms,
        revenue: {
          today: todayAmount,
          yesterday: yesterdayAmount,
          thisWeek: 0, // TODO: 주간 계산
          lastWeek: 0,
          thisMonth: 0, // TODO: 월간 계산
          lastMonth: 0,
          growth: {
            daily: dailyGrowth,
            weekly: 0,
            monthly: 0,
          },
        },
        topServices,
        recentActivity,
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw new Error('Failed to retrieve dashboard metrics.');
  }
};

// Product 관리 서비스 함수들 (임시 구현 - DB 테이블 생성 후 활성화)
export const getProducts = async (filters: any) => {
  try {
    // 임시 샘플 데이터 반환
    const sampleProducts = [
      {
        id: 'instagram_21',
        platform: 'instagram',
        category: 'followers',
        name: '인스타 실제 한국 팔로워',
        description: '100% 실제 활동하는 한국인 유저들이 인스타 공식앱을 통해 직접 방문하여 팔로우를 눌러드리는 방식으로 안전하게 진행됩니다.',
        price: 180,
        originalPrice: 200,
        discount: 10,
        minOrder: 20,
        maxOrder: 3000000,
        deliveryTime: '1~6시간',
        quality: 'premium',
        isActive: true,
        isPopular: true,
        isRecommended: false,
        totalOrders: 1250,
        totalRevenue: 2250000,
        features: ['실제 한국인', '30일 AS', '안전한 방식', '프리미엄 품질'],
        icon: '📷',
        unit: '개',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'instagram_56',
        platform: 'instagram',
        category: 'likes',
        name: '인스타 좋아요',
        description: '인스타그램 게시물의 좋아요를 자연스럽게 증가시켜드립니다.',
        price: 15,
        originalPrice: 20,
        discount: 25,
        minOrder: 10,
        maxOrder: 50000,
        deliveryTime: '1~30분',
        quality: 'premium',
        isActive: true,
        isPopular: true,
        isRecommended: true,
        totalOrders: 890,
        totalRevenue: 1335000,
        features: ['빠른 시작', '30일 AS', '안전한 방식', '자연스러운 증가'],
        icon: '❤️',
        unit: '개',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'youtube_01',
        platform: 'youtube',
        category: 'subscribers',
        name: '유튜브 구독자',
        description: '유튜브 채널의 구독자를 늘려드립니다.',
        price: 25,
        originalPrice: 30,
        discount: 16,
        minOrder: 10,
        maxOrder: 100000,
        deliveryTime: '1~24시간',
        quality: 'premium',
        isActive: true,
        isPopular: true,
        isRecommended: false,
        totalOrders: 567,
        totalRevenue: 1417500,
        features: ['실제 유저', '안전한 방식', '빠른 시작', '고품질'],
        icon: '🎥',
        unit: '명',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'tiktok_01',
        platform: 'tiktok',
        category: 'followers',
        name: '틱톡 팔로워',
        description: '틱톡 계정의 팔로워를 늘려드립니다.',
        price: 30,
        originalPrice: 35,
        discount: 14,
        minOrder: 20,
        maxOrder: 50000,
        deliveryTime: '1~24시간',
        quality: 'premium',
        isActive: true,
        isPopular: false,
        isRecommended: true,
        totalOrders: 234,
        totalRevenue: 702000,
        features: ['실제 유저', '안전한 방식', '고품질', '빠른 시작'],
        icon: '🎵',
        unit: '명',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    const { category, platform, search, page = 1, limit = 50 } = filters;

    let filteredProducts = sampleProducts;

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (platform && platform !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.platform === platform);
    }

    if (search) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return {
      products: filteredProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit),
      },
    };
  } catch (error) {
    console.error('Error getting products:', error);
    throw new Error('Failed to get products');
  }
};

export const createProduct = async (productData: any) => {
  try {
    // 임시 구현 - 실제로는 DB에 저장
    const product = {
      id: `product_${Date.now()}`,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalOrders: 0,
      totalRevenue: 0,
    };
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
};

export const updateProduct = async (id: string, productData: any) => {
  try {
    // 임시 구현 - 실제로는 DB 업데이트
    const product = {
      id,
      ...productData,
      updatedAt: new Date().toISOString(),
    };
    return product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

export const deleteProduct = async (id: string) => {
  try {
    // 임시 구현 - 실제로는 DB에서 삭제
    console.log(`Product ${id} deleted`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

// 플랫폼 관리 서비스 함수들 (임시 구현)
export const getPlatforms = async () => {
  try {
    // 임시 플랫폼 데이터 (실제로는 데이터베이스에서 가져와야 함)
    const platforms = [
      {
        id: 'instagram',
        name: '인스타그램',
        icon: '📷',
        color: '#E4405F',
        isActive: true,
        isVisible: true,
        sortOrder: 1,
        description: '인스타그램 마케팅 서비스',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'youtube',
        name: '유튜브',
        icon: '🎥',
        color: '#FF0000',
        isActive: true,
        isVisible: true,
        sortOrder: 2,
        description: '유튜브 마케팅 서비스',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'tiktok',
        name: '틱톡',
        icon: '🎵',
        color: '#000000',
        isActive: true,
        isVisible: true,
        sortOrder: 3,
        description: '틱톡 마케팅 서비스',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'facebook',
        name: '페이스북',
        icon: '📘',
        color: '#1877F2',
        isActive: true,
        isVisible: true,
        sortOrder: 4,
        description: '페이스북 마케팅 서비스',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'twitter',
        name: '트위터',
        icon: '🐦',
        color: '#1DA1F2',
        isActive: true,
        isVisible: true,
        sortOrder: 5,
        description: '트위터 마케팅 서비스',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    return platforms;
  } catch (error) {
    console.error('Error getting platforms:', error);
    throw new Error('Failed to get platforms');
  }
};

export const createPlatform = async (platformData: any) => {
  try {
    // 임시 구현 - 실제로는 플랫폼 테이블에 저장
    const platform = {
      ...platformData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return platform;
  } catch (error) {
    console.error('Error creating platform:', error);
    throw new Error('Failed to create platform');
  }
};

export const updatePlatform = async (id: string, platformData: any) => {
  try {
    // 임시 구현 - 실제로는 플랫폼 테이블 업데이트
    const platform = {
      id,
      ...platformData,
      updatedAt: new Date().toISOString(),
    };
    return platform;
  } catch (error) {
    console.error('Error updating platform:', error);
    throw new Error('Failed to update platform');
  }
};

export const deletePlatform = async (id: string) => {
  try {
    // 임시 구현 - 실제로는 플랫폼 테이블에서 삭제
    console.log(`Platform ${id} deleted`);
  } catch (error) {
    console.error('Error deleting platform:', error);
    throw new Error('Failed to delete platform');
  }
};

// 주문 관리 서비스 함수들
export const getOrders = async (filters: any) => {
  try {
    const { status, platform, search, page, limit } = filters;

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { targetUrl: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              nickname: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    // 주문 데이터에 플랫폼 정보 추가 (임시)
    const ordersWithPlatform = orders.map(order => ({
      ...order,
      platform: platform || 'instagram', // 임시로 설정
      serviceName: order.targetUrl || '서비스명', // 임시로 설정
    }));

    return {
      orders: ordersWithPlatform,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting orders:', error);
    throw new Error('Failed to get orders');
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: status.toUpperCase() as OrderStatus,
        updatedAt: new Date(),
      },
    });
    return order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

// 알림 관리 서비스 함수들
export const getNotifications = async () => {
  try {
    // 임시 알림 데이터
    const notifications = [
      {
        id: '1',
        type: 'info',
        title: '시스템 업데이트',
        message: '새로운 기능이 추가되었습니다',
        timestamp: new Date().toISOString(),
        isRead: false,
      },
      {
        id: '2',
        type: 'warning',
        title: '서버 점검 안내',
        message: '오늘 밤 12시부터 1시간 점검 예정',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: true,
      },
    ];

    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw new Error('Failed to get notifications');
  }
};
