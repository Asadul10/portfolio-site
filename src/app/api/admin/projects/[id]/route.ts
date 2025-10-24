import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getProjectById, updateProject, deleteProject } from '@/lib/database';
import { z } from 'zod';

const projectUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  category: z.enum(['Web Apps', 'Cybersecurity Labs', 'Networking', 'Data/ML', 'Other']).optional(),
  year: z.number().min(2020).max(2030).optional(),
  tags: z.array(z.string()).min(1, 'At least one tag is required').optional(),
  summary: z.string().min(10, 'Summary must be at least 10 characters').optional(),
  cover: z.string().min(1, 'Cover image is required').optional(),
  featured: z.boolean().optional(),
  content: z.string().optional(),
  notes: z.string().optional(),
  images: z.array(z.object({
    src: z.string(),
    caption: z.string().optional(),
  })).optional(),
  pdfs: z.array(z.object({
    src: z.string(),
    title: z.string(),
    description: z.string().optional(),
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const project = getProjectById(params.id);
    
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const validatedData = projectUpdateSchema.parse(body);
    
    const project = updateProject(params.id, validatedData);
    
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error updating project:', error);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const success = deleteProject(params.id);
    
    if (!success) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
