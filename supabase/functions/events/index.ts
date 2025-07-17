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
      if (pathname.includes('/join/')) {
        // Join event by code
        const eventCode = pathname.split('/join/')[1];
        
        const { data: result, error } = await supabaseClient.rpc('join_event', {
          event_code_param: eventCode,
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
      } else {
        // Get all events
        const { data: events, error } = await supabaseClient
          .from('events')
          .select(`
            *,
            event_participants!inner(count),
            user_profiles!events_created_by_fkey(name)
          `)
          .eq('is_active', true)
          .order('start_date', { ascending: true });

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        return new Response(
          JSON.stringify({ events }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    if (method === 'POST') {
      // Create new event
      const body = await req.json();
      const { name, description, location, start_date, end_date, max_participants = 1000 } = body;

      if (!name || !start_date || !end_date) {
        return new Response(
          JSON.stringify({ error: 'Name, start_date, and end_date are required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Generate unique event code
      const { data: eventCodeResult } = await supabaseClient.rpc('generate_event_code');
      
      const { data: event, error } = await supabaseClient
        .from('events')
        .insert({
          name,
          description,
          location,
          start_date,
          end_date,
          max_participants,
          created_by: user.id,
          event_code: eventCodeResult,
        })
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

      // Auto-join creator as admin
      await supabaseClient
        .from('event_participants')
        .insert({
          event_id: event.id,
          user_id: user.id,
          is_admin: true,
        });

      return new Response(
        JSON.stringify({ event }),
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