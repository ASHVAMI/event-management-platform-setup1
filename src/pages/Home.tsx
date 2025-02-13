import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Calendar as CalendarIcon, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Event = Database['public']['Tables']['events']['Row'] & {
  attendee_count: number;
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [category, searchQuery]);

  const fetchEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          attendee_count:attendees(count)
        `)
        .gte('date', new Date().toISOString()) // Only show upcoming events
        .order('date', { ascending: true }); // Sort by date

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Transform the data to get the actual count value
      const eventsWithCount = (data as any[]).map(event => ({
        ...event,
        attendee_count: event.attendee_count[0]?.count || 0
      }));
      
      setEvents(eventsWithCount);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'conference', 'workshop', 'meetup', 'social', 'other'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-md capitalize whitespace-nowrap ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/event/${event.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
          >
            {event.image_url && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity"></div>
              </div>
            )}
            <div className="p-4 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {event.title}
              </h3>
              <p className="text-gray-600 line-clamp-2">{event.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate max-w-[150px]">{event.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{event.attendee_count} attending</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900">No events found</h3>
          <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}