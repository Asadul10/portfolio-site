import { SiteShell } from '@/components/site-shell';
import { WritingSection } from '@/components/sections/writing-section';
import { getAllPosts } from '@/lib/posts';

export const metadata = {
  title: 'Writing',
  description: 'Technical articles, tutorials, and insights on cybersecurity, web development, and technology.',
};

export default async function WritingPage() {
  const posts = await getAllPosts();

  return (
    <SiteShell>
      <WritingSection posts={posts} />
    </SiteShell>
  );
}
