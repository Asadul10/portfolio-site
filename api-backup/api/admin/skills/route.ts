import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getAllSkills, updateSkills } from '@/lib/database';
import { z } from 'zod';

const skillCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

const skillsSchema = z.array(skillCategorySchema);

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
    const skills = getAllSkills();
    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const validatedData = skillsSchema.parse(body);
    
    updateSkills(validatedData);
    
    return NextResponse.json({ message: 'Skills updated successfully' });
  } catch (error) {
    console.error('Error updating skills:', error);

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
