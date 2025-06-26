import { createClient } from '@supabase/supabase-js'

// Supabase 설정
const supabaseUrl = 'https://hzfhquweycpsisljwtft.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZmhxdXdleWNwc2lzbGp3dGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NzI1OTYsImV4cCI6MjA2NTU0ODU5Nn0.WAGb06b6rpBHjM0jn09gnCaO-QHMRmqHGtSBlQ8d2kg'

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 데이터베이스 타입 정의
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          nickname: string
          password_hash: string
          balance: number
          total_orders: number
          total_spent: number
          user_type: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nickname: string
          password_hash: string
          balance?: number
          total_orders?: number
          total_spent?: number
          user_type?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nickname?: string
          password_hash?: string
          balance?: number
          total_orders?: number
          total_spent?: number
          user_type?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          platform: string
          category: string
          price: number
          min_quantity: number
          max_quantity: number
          discount_rate: number
          estimated_time: string
          quality_level: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          platform: string
          category: string
          price: number
          min_quantity?: number
          max_quantity?: number
          discount_rate?: number
          estimated_time?: string
          quality_level?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          platform?: string
          category?: string
          price?: number
          min_quantity?: number
          max_quantity?: number
          discount_rate?: number
          estimated_time?: string
          quality_level?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          service_id: string
          platform: string
          service_name: string
          quantity: number
          target_url: string
          original_price: number
          discount_amount: number
          final_price: number
          points_used: number
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          platform: string
          service_name: string
          quantity: number
          target_url: string
          original_price: number
          discount_amount?: number
          final_price: number
          points_used?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string
          platform?: string
          service_name?: string
          quantity?: number
          target_url?: string
          original_price?: number
          discount_amount?: number
          final_price?: number
          points_used?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          order_id: string
          message: string
          type: 'new_order' | 'order_completed' | 'order_failed'
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          message: string
          type: 'new_order' | 'order_completed' | 'order_failed'
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          message?: string
          type?: 'new_order' | 'order_completed' | 'order_failed'
          is_read?: boolean
          created_at?: string
        }
      }
      bulk_discounts: {
        Row: {
          id: string
          service_id: string
          min_quantity: number
          discount_percent: number
          created_at: string
        }
        Insert: {
          id?: string
          service_id: string
          min_quantity: number
          discount_percent: number
          created_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          min_quantity?: number
          discount_percent?: number
          created_at?: string
        }
      }
      payment_transactions: {
        Row: {
          id: string
          user_id: string
          type: 'charge' | 'payment' | 'refund'
          method: string | null
          amount: number
          status: 'pending' | 'completed' | 'failed'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'charge' | 'payment' | 'refund'
          method?: string | null
          amount: number
          status?: 'pending' | 'completed' | 'failed'
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'charge' | 'payment' | 'refund'
          method?: string | null
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
          description?: string | null
          created_at?: string
        }
      }
    }
  }
}
