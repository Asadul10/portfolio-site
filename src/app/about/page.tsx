import { SiteShell } from '@/components/site-shell';
import { AboutSection } from '@/components/sections/about-section';

export const metadata = {
  title: 'About',
  description: 'Learn more about my background in cybersecurity, full-stack development, and technical expertise.',
};

export default function AboutPage() {
  return (
    <SiteShell>
      <AboutSection />
    </SiteShell>
  );
}
