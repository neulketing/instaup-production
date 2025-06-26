-- ========================================
-- INSTAUP 데이터베이스 스키마
-- Supabase PostgreSQL용
-- ========================================

-- 1. Users 테이블 (사용자 정보)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  balance INTEGER DEFAULT 10000, -- 포인트 (원 단위)
  total_orders INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  user_type VARCHAR(20) DEFAULT 'user', -- 'user' 또는 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Services 테이블 (서비스 설정)
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL, -- 기본 가격 (원 단위)
  min_quantity INTEGER DEFAULT 100,
  max_quantity INTEGER DEFAULT 100000,
  discount_rate INTEGER DEFAULT 0, -- 기본 할인율 (%)
  estimated_time VARCHAR(100) DEFAULT '24-48시간',
  quality_level VARCHAR(50) DEFAULT '프리미엄',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bulk Discounts 테이블 (대량 할인 규칙)
CREATE TABLE bulk_discounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL,
  discount_percent INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Orders 테이블 (주문 정보)
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),

  -- 주문 정보
  platform VARCHAR(100) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  target_url TEXT NOT NULL,

  -- 가격 정보
  original_price INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  final_price INTEGER NOT NULL,
  points_used INTEGER DEFAULT 0,

  -- 상태 및 메타데이터
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed, cancelled
  notes TEXT,

  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Notifications 테이블 (알림 시스템)
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- new_order, order_completed, order_failed
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Payment Transactions 테이블 (결제/충전 내역)
CREATE TABLE payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- charge, payment, refund
  method VARCHAR(20), -- card, bank
  amount INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 인덱스 생성 (성능 최적화)
-- ========================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_notifications_order_id ON notifications(order_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_bulk_discounts_service_id ON bulk_discounts(service_id);
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);

-- ========================================
-- 트리거 함수 (자동 업데이트)
-- ========================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ========================================
-- RLS (Row Level Security) 정책
-- ========================================

-- Users 테이블 RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 조회/수정 가능
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Orders 테이블 RLS 활성화
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 주문만 조회 가능, 관리자는 모든 주문 조회 가능
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin')
);

-- 사용자는 자신의 주문만 생성 가능
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 관리자만 주문 상태 업데이트 가능
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin')
);

-- ========================================
-- 기본 데이터 삽입
-- ========================================

-- 기본 서비스 데이터
INSERT INTO services (name, platform, category, price, min_quantity, max_quantity, discount_rate, estimated_time, quality_level) VALUES
('한국인 팔로워', 'Instagram', '팔로워', 120, 100, 10000, 20, '24-48시간', '프리미엄'),
('조회수', 'YouTube', '조회수', 5, 1000, 100000, 15, '12-24시간', '고품질'),
('좋아요', 'TikTok', '좋아요', 20, 100, 50000, 10, '6-12시간', '실제계정'),
('구독자', 'YouTube', '구독자', 150, 50, 5000, 25, '48-72시간', '프리미엄'),
('좋아요', 'Instagram', '좋아요', 15, 100, 20000, 5, '1-6시간', '실제계정');

-- 대량 할인 규칙 (Instagram 팔로워 예시)
INSERT INTO bulk_discounts (service_id, min_quantity, discount_percent)
SELECT id, 500, 5 FROM services WHERE name = '한국인 팔로워' AND platform = 'Instagram';

INSERT INTO bulk_discounts (service_id, min_quantity, discount_percent)
SELECT id, 1000, 10 FROM services WHERE name = '한국인 팔로워' AND platform = 'Instagram';

INSERT INTO bulk_discounts (service_id, min_quantity, discount_percent)
SELECT id, 3000, 15 FROM services WHERE name = '한국인 팔로워' AND platform = 'Instagram';

INSERT INTO bulk_discounts (service_id, min_quantity, discount_percent)
SELECT id, 5000, 20 FROM services WHERE name = '한국인 팔로워' AND platform = 'Instagram';

-- 관리자 계정 생성 (비밀번호는 해시화 필요)
INSERT INTO users (email, nickname, password_hash, balance, user_type) VALUES
('neulketing@gmail.com', '관리자', '$2b$10$example_hash_here', 0, 'admin');

-- 테스트 사용자 계정
INSERT INTO users (email, nickname, password_hash, balance) VALUES
('user@example.com', '인스타업러', '$2b$10$example_hash_here', 125000);
