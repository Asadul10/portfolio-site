import { SiteShell } from '@/components/site-shell';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturedProjects } from '@/components/sections/featured-projects';
import { getFeaturedProjects } from '@/lib/projects';

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <SiteShell>
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
    </SiteShell>
  );
}
