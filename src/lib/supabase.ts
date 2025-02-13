import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with the database
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper function to subscribe to real-time updates for a specific event
export const subscribeToEvent = (
  eventId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`event-${eventId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'attendees',
        filter: `event_id=eq.${eventId}`
      },
      callback
    )
    .subscribe();
};