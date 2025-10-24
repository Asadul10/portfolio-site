import { SiteShell } from '@/components/site-shell';
import { ProjectsSection } from '@/components/sections/projects-section';
import { getAllProjects } from '@/lib/projects';

export const metadata = {
  title: 'Projects',
  description: 'Explore my portfolio of cybersecurity, web development, and networking projects.',
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <SiteShell>
      <ProjectsSection projects={projects} />
    </SiteShell>
  );
}
