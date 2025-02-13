# EventHub - Event Management Platform

A modern event management platform built with React, TypeScript, and Supabase. Users can create, manage, and attend events with real-time updates.

![EventHub Screenshot](https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80)

## Features

- 🔐 User Authentication (Email/Password and Guest Access)
- 📅 Event Creation and Management
- 🔄 Real-time Updates for Event Attendance
- 🎯 Event Categories and Search
- 📱 Responsive Design
- 🖼️ Event Image Support
- 👥 Attendee Management

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Vite
  - React Router DOM
  - Lucide React (Icons)
  - React Hot Toast (Notifications)

- **Backend:**
  - Supabase (Database & Authentication)
  - PostgreSQL
  - Row Level Security (RLS)

## Demo Credentials

You can use either of these options to access the platform:

1. **Guest Access:**
   - Click "Continue as Guest" on the login page
   - Automatically logs you in with demo data

2. **Demo Account:**
   - Email: guest@eventhub.demo
   - Password: guestpass123!

## Local Development

1. Clone the repository:
git clone <repository-url>
cd event-management-platform

2. Install dependencies:
npm install

3. Create a `.env` file in the root directory with your Supabase credentials:
VITE_SUPABASE_URL=https://cguvxqczwseyrkbrcfvq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNndXZ4cWN6d3NleXJrYnJjZnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNDE1OTcsImV4cCI6MjA1NDkxNzU5N30.3ODhkkZyHo4mn5EIyHvHDbdbhLayUgoh7P6mQHr12Bc

4. Start the development server:
npm run dev

## Database Schema

### Events Table
- `id`: UUID (Primary Key)
- `created_at`: Timestamp
- `title`: Text
- `description`: Text
- `date`: Timestamp
- `location`: Text
- `category`: Text
- `user_id`: UUID (Foreign Key to auth.users)
- `image_url`: Text (Optional)

### Attendees Table
- `id`: UUID (Primary Key)
- `created_at`: Timestamp
- `event_id`: UUID (Foreign Key to events)
- `user_id`: UUID (Foreign Key to auth.users)

## Security

- Row Level Security (RLS) policies ensure data access control
- JWT-based authentication
- Secure password handling through Supabase Auth
- Protected API endpoints

## Features in Detail

### Authentication
- Email/Password registration and login
- Guest access with demo data
- Protected routes for authenticated users

### Event Management
- Create new events with title, description, date, location, and optional image
- Edit and delete own events
- View event details and attendee count
- Real-time updates for attendance changes

### Event Discovery
- Browse all upcoming events
- Filter events by category
- Search events by title
- Sort events by date

### User Interface
- Responsive design for all screen sizes
- Toast notifications for user feedback
- Loading states and error handling
- Clean and modern UI with Tailwind CSS

## Deployment

The application is deployed on Netlify and can be accessed at:
https://brilliant-belekoy-1f77e3.netlify.app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.



Developed by Ashvani S !!!!
