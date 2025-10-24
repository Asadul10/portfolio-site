import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getSiteConfig, updateSiteConfig } from '@/lib/database';
import { z } from 'zod';

const siteConfigSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  github: z.string().url('Invalid GitHub URL'),
  linkedin: z.string().url('Invalid LinkedIn URL'),
  twitter: z.string().url('Invalid Twitter URL'),
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
    const config = getSiteConfig();
    return NextResponse.json({ config });
  } catch (error) {
    console.error('Error fetching site config:', error);
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
    const validatedData = siteConfigSchema.parse(body);
    
    updateSiteConfig(validatedData);
    
    return NextResponse.json({ message: 'Site config updated successfully' });
  } catch (error) {
    console.error('Error updating site config:', error);

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
