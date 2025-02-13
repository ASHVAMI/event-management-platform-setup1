export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          date: string
          location: string
          category: string
          user_id: string
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          date: string
          location: string
          category: string
          user_id: string
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          date?: string
          location?: string
          category?: string
          user_id?: string
          image_url?: string | null
        }
      }
      attendees: {
        Row: {
          id: string
          created_at: string
          event_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          event_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          event_id?: string
          user_id?: string
        }
      }
    }
  }
}