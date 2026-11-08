import type { Metadata } from 'next';
import AboutPageContent from '@/components/AboutPageContent';

export const metadata: Metadata = {
  title: 'About Us — SPANYX | Where Technology Meets Opportunity',
  description:
    'Our mission is to bridge the gap between complexity and efficiency, ensuring every organization can thrive in a digital-first world.',
};

export default function AboutUsPage() {
  return <AboutPageContent />;
}

