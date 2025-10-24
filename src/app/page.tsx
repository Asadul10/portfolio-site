import { SiteShell } from '@/components/site-shell';
import { HeroSection } from '@/components/sections/hero-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { FeaturedProjects } from '@/components/sections/featured-projects';
import { getFeaturedProjects } from '@/lib/projects';

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <SiteShell>
      <HeroSection />
      <SkillsSection />
      <FeaturedProjects projects={featuredProjects} />
    </SiteShell>
  );
}
