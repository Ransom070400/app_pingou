import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
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
        };
        Insert: Partial<Database['public']['Tables']['user_profiles']['Row']>;
        Update: Partial<Database['public']['Tables']['user_profiles']['Row']>;
      };
    };
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
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

    const method = req.method;

    if (method === 'GET') {
      // Get user profile
      const { data: profile, error } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabaseClient
            .from('user_profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || '',
            })
            .select()
            .single();

          if (createError) {
            return new Response(
              JSON.stringify({ error: createError.message }),
              {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          }

          return new Response(
            JSON.stringify({ profile: newProfile }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ profile }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (method === 'PUT') {
      // Update user profile
      const body = await req.json();
      const { name, nickname, phone, instagram, twitter, linkedin, avatar_url } = body;

      const { data: profile, error } = await supabaseClient
        .from('user_profiles')
        .update({
          name,
          nickname,
          phone,
          instagram,
          twitter,
          linkedin,
          avatar_url,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Check for new achievements after profile update
      const { data: achievementResult } = await supabaseClient.rpc('check_and_award_achievements');

      return new Response(
        JSON.stringify({ 
          profile, 
          achievements: achievementResult 
        }),
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