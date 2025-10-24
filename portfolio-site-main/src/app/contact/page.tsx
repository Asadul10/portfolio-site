import { SiteShell } from '@/components/site-shell';
import { ContactSection } from '@/components/sections/contact-section';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with me for cybersecurity consulting, web development, or collaboration opportunities.',
};

export default function ContactPage() {
  return (
    <SiteShell>
      <ContactSection />
    </SiteShell>
  );
}
