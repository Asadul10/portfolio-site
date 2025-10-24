import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getAllProjects, createProject } from '@/lib/database';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['Web Apps', 'Cybersecurity Labs', 'Networking', 'Data/ML', 'Other']),
  year: z.number().min(2020).max(2030),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  cover: z.string().min(1, 'Cover image is required'),
  featured: z.boolean().optional(),
  content: z.string().optional(),
  notes: z.string().optional(),
  images: z.array(z.object({
    src: z.string(),
    caption: z.string().optional()
  })).optional(),
  pdfs: z.array(z.object({
    src: z.string(),
    title: z.string(),
    description: z.string().optional()
  })).optional(),
});

function requireAuth(request: NextRequest) {
  const user = getUserFromToken(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
  return null;
}

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const projects = getAllProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const validatedData = projectSchema.parse(body);
    
    const project = createProject(validatedData);
    
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
