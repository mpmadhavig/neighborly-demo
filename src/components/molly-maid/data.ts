import { Home, Calendar, Star, Check } from 'lucide-react';

export const services = [
  { id: 1, name: 'Regular Cleaning', description: 'Recurring cleaning services tailored to your schedule', icon: Home },
  { id: 2, name: 'Deep Cleaning', description: 'Thorough cleaning for every corner of your home', icon: Star },
  { id: 3, name: 'Move In/Out Cleaning', description: 'Complete cleaning for moving transitions', icon: Calendar },
  { id: 4, name: 'Specialty Cleaning', description: 'Custom cleaning for specific needs', icon: Check }
];

export const testimonials = [
  { name: 'Sarah M.', rating: 5, text: 'Outstanding service! My home has never been cleaner.' },
  { name: 'John D.', rating: 5, text: 'Professional, reliable, and thorough. Highly recommend!' },
  { name: 'Emily R.', rating: 5, text: 'The team is amazing. They pay attention to every detail.' }
];

export const blogPosts = [
  { title: 'How Often Should I Have My House Cleaned?', excerpt: 'Factors to consider when deciding the frequency of professional cleanings.' },
  { title: 'Cleaning Schedule For Working Parents', excerpt: '10 best cleaning tips for busy moms and dads.' },
  { title: 'House Cleaning Tips for Seniors', excerpt: 'Advice to help seniors stay self-sufficient with cleaning.' }
];
