import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const url = new URL(req.url);
    const method = req.method;
    const pathname = url.pathname;

    if (method === 'GET') {
      if (pathname.includes('/achievements')) {
        // Get user achievements
        const { data: achievements, error } = await supabaseClient
          .from('user_achievements')
          .select(`
            *,
            achievements(*)
          `)
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Get all available achievements
        const { data: allAchievements, error: allError } = await supabaseClient
          .from('achievements')
          .select('*')
          .eq('is_active', true)
          .order('requirement_value', { ascending: true });

        if (allError) {
          return new Response(
            JSON.stringify({ error: allError.message }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        return new Response(
          JSON.stringify({ 
            user_achievements: achievements,
            all_achievements: allAchievements 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } else {
        // Get available rewards and user's redeemed rewards
        const { data: rewards, error: rewardsError } = await supabaseClient
          .from('rewards')
          .select('*')
          .eq('is_active', true)
          .order('cost', { ascending: true });

        const { data: userRewards, error: userRewardsError } = await supabaseClient
          .from('user_rewards')
          .select(`
            *,
            rewards(*)
          `)
          .eq('user_id', user.id)
          .order('redeemed_at', { ascending: false });

        if (rewardsError || userRewardsError) {
          return new Response(
            JSON.stringify({ error: rewardsError?.message || userRewardsError?.message }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        return new Response(
          JSON.stringify({ 
            rewards,
            user_rewards: userRewards 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    if (method === 'POST') {
      // Redeem reward
      const body = await req.json();
      const { reward_id } = body;

      if (!reward_id) {
        return new Response(
          JSON.stringify({ error: 'Reward ID is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const { data: result, error } = await supabaseClient.rpc('redeem_reward', {
        reward_id_param: reward_id,
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (!result.success) {
        return new Response(
          JSON.stringify({ error: result.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify(result),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});