import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  nickname: string;
  phone: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  avatar_url: string;
  ping_tokens: number;
  qr_code_data: string;
  created_at: string;
  updated_at: string;
}

export interface Connection {
  connection_id: string;
  connected_user_id: string;
  connected_user_name: string;
  connected_user_email: string;
  connected_user_nickname: string;
  connected_user_avatar_url: string;
  connection_method: string;
  ping_tokens_earned: number;
  connected_at: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  reward_type: 'voucher' | 'feature' | 'access';
  is_active: boolean;
  metadata: any;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement_type: 'connections' | 'ping_tokens' | 'streak';
  requirement_value: number;
  reward_tokens: number;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievements: Achievement;
}

// API functions
export const api = {
  // Profile functions
  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${supabaseUrl}/functions/v1/profile`, {
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    const data = await response.json();
    return data.profile;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${supabaseUrl}/functions/v1/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    const data = await response.json();
    return data.profile;
  },

  // Connection functions
  async getConnections(): Promise<Connection[]> {
    const response = await fetch(`${supabaseUrl}/functions/v1/connections`, {
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch connections');
    }
    
    const data = await response.json();
    return data.connections;
  },

  async createConnection(qrCodeData: string): Promise<any> {
    const response = await fetch(`${supabaseUrl}/functions/v1/connections`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        qr_code_data: qrCodeData,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create connection');
    }
    
    return response.json();
  },

  // Rewards functions
  async getRewards(): Promise<{ rewards: Reward[]; user_rewards: any[] }> {
    const response = await fetch(`${supabaseUrl}/functions/v1/rewards`, {
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch rewards');
    }
    
    return response.json();
  },

  async redeemReward(rewardId: string): Promise<any> {
    const response = await fetch(`${supabaseUrl}/functions/v1/rewards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reward_id: rewardId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to redeem reward');
    }
    
    return response.json();
  },

  async getAchievements(): Promise<{ user_achievements: UserAchievement[]; all_achievements: Achievement[] }> {
    const response = await fetch(`${supabaseUrl}/functions/v1/rewards/achievements`, {
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch achievements');
    }
    
    return response.json();
  },
};