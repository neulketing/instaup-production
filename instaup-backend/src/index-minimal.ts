// ===========================================
// 플랫폼 관리 API 엔드포인트
// ===========================================

// 플랫폼 목록 조회
app.get('/api/admin/platforms', async (req, res) => {
  try {
    // 목 데이터 (실제로는 데이터베이스에서 조회)
    const platforms = [
      {
        id: 'instagram',
        name: '인스타그램',
        icon: '📷',
        color: '#E4405F',
        isActive: true,
        isVisible: true,
        sortOrder: 1,
        description: '팔로워, 좋아요, 조회수 서비스',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'youtube',
        name: '유튜브',
        icon: '🎥',
        color: '#FF0000',
        isActive: true,
        isVisible: true,
        sortOrder: 2,
        description: '구독자, 조회수, 좋아요 서비스',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'tiktok',
        name: '틱톡',
        icon: '🎵',
        color: '#000000',
        isActive: true,
        isVisible: true,
        sortOrder: 3,
        description: '팔로워, 좋아요, 조회수 서비스',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'facebook',
        name: '페이스북',
        icon: '📘',
        color: '#1877F2',
        isActive: true,
        isVisible: true,
        sortOrder: 4,
        description: '페이지 좋아요, 팔로워 서비스',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'twitter',
        name: '트위터',
        icon: '🐦',
        color: '#1DA1F2',
        isActive: true,
        isVisible: true,
        sortOrder: 5,
        description: '팔로워, 좋아요, 리트윗 서비스',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'threads',
        name: '스레드',
        icon: '🔗',
        color: '#000000',
        isActive: false,
        isVisible: false,
        sortOrder: 6,
        description: '스레드 팔로워, 좋아요 서비스',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'naver_blog',
        name: 'Nz로블',
        icon: '📌',
        color: '#03C75A',
        isActive: false,
        isVisible: false,
        sortOrder: 7,
        description: '네이버 블로그 마케팅',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'kakao',
        name: '카카오',
        icon: '📺',
        color: '#FFCD00',
        isActive: false,
        isVisible: false,
        sortOrder: 8,
        description: '카카오 플랫폼 마케팅',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // 정렬순서대로 정렬
    const sortedPlatforms = platforms.sort((a, b) => a.sortOrder - b.sortOrder);

    res.json({
      success: true,
      data: sortedPlatforms
    });
  } catch (error) {
    console.error('Platforms API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch platforms'
    });
  }
});

// 플랫폼 생성
app.post('/api/admin/platforms', async (req, res) => {
  try {
    const platformData = req.body;

    // 실제로는 데이터베이스에 저장
    const newPlatform = {
      id: platformData.id || `platform_${Date.now()}`,
      ...platformData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: newPlatform,
      message: '플랫폼이 성공적으로 생성되었습니다.'
    });
  } catch (error) {
    console.error('Create Platform Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create platform'
    });
  }
});

// 플랫폼 수정
app.put('/api/admin/platforms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 실제로는 데이터베이스에서 업데이트
    const updatedPlatform = {
      id,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedPlatform,
      message: '플랫폼이 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    console.error('Update Platform Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update platform'
    });
  }
});

// 플랫폼 삭제
app.delete('/api/admin/platforms/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 실제로는 데이터베이스에서 삭제 (또는 soft delete)

    res.json({
      success: true,
      message: '플랫폼이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('Delete Platform Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete platform'
    });
  }
});

// 공개 플랫폼 목록 조회 (활성화된 것만)
app.get('/api/platforms', async (req, res) => {
  try {
    // 활성화되고 보이는 플랫폼만 반환
    const platforms = [
      {
        id: 'instagram',
        name: '인스타그램',
        icon: '📷',
        color: '#E4405F',
        description: '팔로워, 좋아요, 조회수 서비스'
      },
      {
        id: 'youtube',
        name: '유튜브',
        icon: '🎥',
        color: '#FF0000',
        description: '구독자, 조회수, 좋아요 서비스'
      },
      {
        id: 'tiktok',
        name: '틱톡',
        icon: '🎵',
        color: '#000000',
        description: '팔로워, 좋아요, 조회수 서비스'
      },
      {
        id: 'facebook',
        name: '페이스북',
        icon: '📘',
        color: '#1877F2',
        description: '페이지 좋아요, 팔로워 서비스'
      },
      {
        id: 'twitter',
        name: '트위터',
        icon: '🐦',
        color: '#1DA1F2',
        description: '팔로워, 좋아요, 리트윗 서비스'
      }
    ];

    res.json({
      success: true,
      data: platforms
    });
  } catch (error) {
    console.error('Public Platforms API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch platforms'
    });
  }
});

// 기존 상품 관리 API 수정 (가격을 1개당으로 변경, 할인율 추가)
app.get('/api/admin/products', async (req, res) => {
  try {
    const { category, platform, status, search, page = 1, limit = 20 } = req.query

    // 목 데이터 (실제로는 데이터베이스에서 조회) - 가격을 1개당으로 변경
    const products = [
      {
        id: 'instagram_21',
        platform: 'instagram',
        category: 'followers',
        name: '인스타 실제 한국 팔로워',
        description: '100% 실제 활동하는 한국인 유저들이 인스타 공식앱을 통해 직접 방문하여 팔로우를 눌러드리는 방식으로 안전하게 진행됩니다.',
        price: 1.8, // 1개당 1.8원 (기존 180원/100개)
        originalPrice: 2.2, // 1개당 2.2원
        discount: 18, // 할인율 18%
        minOrder: 20,
        maxOrder: 3000000,
        deliveryTime: '1~6시간',
        quality: 'premium',
        isActive: true,
        isPopular: true,
        isRecommended: true,
        totalOrders: 1234,
        totalRevenue: 22248000,
        features: ['실제 한국인', '30일 AS', '안전한 방식', '프리미엄 품질'],
        warningNote: '계정을 비공개로 설정하시면 서비스가 불가능합니다.',
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'instagram_56',
        platform: 'instagram',
        category: 'likes',
        name: '인스타 좋아요',
        description: '인스타그램 게시물의 좋아요를 자연스럽게 증가시켜드립니다.',
        price: 0.15, // 1개당 0.15원 (기존 15원/100개)
        originalPrice: 0.20, // 1개당 0.20원
        discount: 25, // 할인율 25%
        minOrder: 10,
        maxOrder: 50000,
        deliveryTime: '1~30분',
        quality: 'premium',
        isActive: true,
        isPopular: true,
        isRecommended: false,
        totalOrders: 856,
        totalRevenue: 12840000,
        features: ['빠른 시작', '30일 AS', '안전한 방식', '자연스러운 증가'],
        warningNote: '작업 진행 중 게시물 삭제 금지',
        createdAt: new Date('2024-01-20').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'youtube_01',
        platform: 'youtube',
        category: 'subscribers',
        name: '유튜브 구독자',
        description: '유튜브 채널의 구독자를 늘려드립니다.',
        price: 0.25, // 1개당 0.25원 (기존 25원/100개)
        originalPrice: 0.30, // 1개당 0.30원
        discount: 17, // 할인율 17%
        minOrder: 10,
        maxOrder: 100000,
        deliveryTime: '1~24시간',
        quality: 'premium',
        isActive: true,
        isPopular: false,
        isRecommended: true,
        totalOrders: 423,
        totalRevenue: 10575000,
        features: ['실제 유저', '안전한 방식', '빠른 시작', '고품질'],
        warningNote: '채널이 공개 상태여야 합니다.',
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // 필터링 로직 (실제로는 데이터베이스 쿼리로 처리)
    let filteredProducts = products

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category)
    }

    if (platform && platform !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.platform === platform)
    }

    if (search) {
      const searchTerm = search.toString().toLowerCase()
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      )
    }

    const total = filteredProducts.length
    const pageNum = parseInt(page.toString())
    const limitNum = parseInt(limit.toString())
    const offset = (pageNum - 1) * limitNum
    const paginatedProducts = filteredProducts.slice(offset, offset + limitNum)

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    })
  } catch (error) {
    console.error('Products API Error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
