import { supabase } from './supabase';

const sampleEvents = [
  {
    title: 'Tech Conference 2025',
    description: 'Join us for the biggest tech conference of the year! Featuring keynote speakers from leading tech companies, hands-on workshops, and networking opportunities.\n\nTopics include:\n- AI and Machine Learning\n- Web Development\n- Cloud Computing\n- Cybersecurity',
    date: '2025-06-15T09:00:00',
    location: 'San Francisco Convention Center',
    category: 'conference',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80'
  },
  {
    title: 'Digital Marketing Workshop',
    description: 'Learn the latest digital marketing strategies from industry experts. This hands-on workshop will cover social media marketing, SEO, content marketing, and paid advertising.',
    date: '2025-04-20T14:00:00',
    location: 'Digital Marketing Hub, New York',
    category: 'workshop',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80'
  },
  {
    title: 'Startup Networking Mixer',
    description: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts. Perfect opportunity to pitch your ideas and find potential collaborators.',
    date: '2025-03-10T18:30:00',
    location: 'Innovation Hub, Austin',
    category: 'social',
    image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80'
  },
  {
    title: 'AI in Healthcare Symposium',
    description: 'Explore the intersection of artificial intelligence and healthcare. Leading researchers and practitioners will discuss the latest developments and future possibilities.',
    date: '2025-05-25T10:00:00',
    location: 'Medical Research Center, Boston',
    category: 'conference',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80'
  },
  {
    title: 'Web3 Development Bootcamp',
    description: 'Intensive workshop on blockchain development, smart contracts, and decentralized applications. Get hands-on experience with the latest Web3 technologies.',
    date: '2025-07-05T09:00:00',
    location: 'Virtual Event',
    category: 'workshop',
    image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80'
  }
];

export const addSampleEvents = async (userId: string) => {
  const { error } = await supabase
    .from('events')
    .insert(
      sampleEvents.map(event => ({
        ...event,
        user_id: userId
      }))
    );

  if (error) {
    console.error('Error adding sample events:', error);
    throw error;
  }
};