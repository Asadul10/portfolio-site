import { NextRequest, NextResponse } from 'next/server';
import { searchProjects } from '@/lib/projects';
import { searchPosts } from '@/lib/posts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';

    if (!query || query.length < 2) {
      return NextResponse.json(
        { message: 'Query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    let results: Array<{
      type: 'project' | 'post';
      title: string;
      slug: string;
      summary: string;
      tags: string[];
      category?: string;
      year?: number;
      date?: string;
    }> = [];

    if (type === 'all' || type === 'projects') {
      const projects = await searchProjects(query);
      results = [...results, ...projects.map(project => ({
        type: 'project',
        title: project.title,
        slug: project.slug,
        summary: project.summary,
        tags: project.tags,
        category: project.category,
        year: project.year,
      }))];
    }

    if (type === 'all' || type === 'posts') {
      const posts = await searchPosts(query);
      results = [...results, ...posts.map(post => ({
        type: 'post',
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        tags: post.tags,
        date: post.date,
      }))];
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
