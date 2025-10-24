import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/site-shell';
import { ProjectDetail } from '@/components/sections/project-detail';
import { getProjectBySlug, getProjectSlugs } from '@/lib/projects';
import { generateMetadata as generateMetadataUtil } from '@/lib/utils';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return generateMetadataUtil({
    title: project.title,
    description: project.summary,
    image: project.cover,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <SiteShell>
      <ProjectDetail project={project} />
    </SiteShell>
  );
}
