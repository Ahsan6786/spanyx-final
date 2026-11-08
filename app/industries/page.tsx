import type { Metadata } from 'next';
import IndustriesPageContent from '@/components/IndustriesPageContent';

export const metadata: Metadata = {
  title: 'Industries We Serve — SPANYX | Specialized Software Engineering',
  description:
    'Explore the 16 core industry sectors Spanyx serves: Real Estate, FinTech, Higher Education, E-Commerce, Healthcare, B2B Trade, Hospitality, AI Agents, and beyond.',
  openGraph: {
    title: 'Industries We Serve — SPANYX',
    description:
      'Specialized software engineering and custom technology solutions engineered for 16 core industry sectors.',
    type: 'website',
  },
};

export default function IndustriesPage() {
  return <IndustriesPageContent />;
}

