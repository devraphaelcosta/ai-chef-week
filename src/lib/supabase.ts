import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
          points: number
          current_streak: number
          max_streak: number
          preferences: any
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          level?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
          points?: number
          current_streak?: number
          max_streak?: number
          preferences?: any
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          level?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
          points?: number
          current_streak?: number
          max_streak?: number
          preferences?: any
        }
      }
      weekly_menus: {
        Row: {
          id: string
          user_id: string
          week_start: string
          meals: any
          shopping_list: any
          created_at: string
          ai_preferences: any
        }
        Insert: {
          id?: string
          user_id: string
          week_start: string
          meals: any
          shopping_list: any
          ai_preferences?: any
        }
        Update: {
          id?: string
          user_id?: string
          week_start?: string
          meals?: any
          shopping_list?: any
          ai_preferences?: any
        }
      }
      challenges: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          points_reward: number
          completed: boolean
          completed_at: string | null
          created_at: string
          challenge_type: 'daily' | 'weekly' | 'monthly'
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          points_reward: number
          completed?: boolean
          completed_at?: string | null
          challenge_type: 'daily' | 'weekly' | 'monthly'
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          points_reward?: number
          completed?: boolean
          completed_at?: string | null
          challenge_type?: 'daily' | 'weekly' | 'monthly'
        }
      }
    }
  }
}