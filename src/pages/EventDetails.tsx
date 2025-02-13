import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Calendar as CalendarIcon, Users, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase, subscribeToEvent } from '../lib/supabase';
import { Database } from '../types/supabase';

type Event = Database['public']['Tables']['events']['Row'] & {
  attendees: Database['public']['Tables']['attendees']['Row'][];
  creator: { email: string } | null;
};

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchEventDetails();

    // Subscribe to real-time updates
    const subscription = subscribeToEvent(id, (payload) => {
      if (payload.eventType === 'INSERT') {
        setAttendeeCount((prev) => prev + 1);
      } else if (payload.eventType === 'DELETE') {
        setAttendeeCount((prev) => prev - 1);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const { data: event, error } = await supabase
        .from('events')
        .select(`
          *,
          attendees (
            id,
            user_id
          ),
          creator:user_id (
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setEvent(event);
      setAttendeeCount(event.attendees.length);
      setIsAttending(
        event.attendees.some((a) => a.user_id === user?.id)
      );
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async () => {
    if (!user) {
      toast.error('Please sign in to attend events');
      navigate('/login');
      return;
    }

    try {
      if (isAttending) {
        const { error } = await supabase
          .from('attendees')
          .delete()
          .eq('event_id', id)
          .eq('user_id', user.id);

        if (error) throw error;
        setIsAttending(false);
        toast.success('You are no longer attending this event');
      } else {
        const { error } = await supabase
          .from('attendees')
          .insert({
            event_id: id!,
            user_id: user.id
          });

        if (error) throw error;
        setIsAttending(true);
        toast.success('You are now attending this event');
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Failed to update attendance');
    }
  };

  const handleDelete = async () => {
    if (!user || event?.user_id !== user.id) return;

    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Event deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
        <p className="mt-2 text-gray-600">The event you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-64 object-cover rounded-lg shadow-md"
        />
      )}

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          {user?.id === event.user_id && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/edit-event/${id}`)}
                className="p-2 text-gray-600 hover:text-indigo-600"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-600 hover:text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(new Date(event.date), 'PPP')}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{attendeeCount} attending</span>
          </div>
        </div>

        <p className="mt-6 text-gray-600 whitespace-pre-wrap">{event.description}</p>

        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Created by {event.creator?.email}
          </div>
          <button
            onClick={handleAttendance}
            className={`px-6 py-2 rounded-md ${
              isAttending
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isAttending ? 'Cancel Attendance' : 'Attend Event'}
          </button>
        </div>
      </div>
    </div>
  );
}