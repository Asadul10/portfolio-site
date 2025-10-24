import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const images: Array<{ src: string; caption?: string }> = [];
    const pdfs: Array<{ src: string; title: string; description?: string }> = [];

    // Process images
    const imageFiles = formData.getAll('images') as File[];
    const imageCaptions = formData.getAll('image_captions') as string[];
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file && file.type.startsWith('image/')) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const timestamp = Date.now();
        const filename = `image_${timestamp}_${i}.${file.name.split('.').pop()}`;
        const filepath = join(uploadsDir, filename);
        
        await writeFile(filepath, buffer);
        
        images.push({
          src: `/uploads/${filename}`,
          caption: imageCaptions[i] || ''
        });
      }
    }

    // Process PDFs
    const pdfFiles = formData.getAll('pdfs') as File[];
    const pdfTitles = formData.getAll('pdf_titles') as string[];
    const pdfDescriptions = formData.getAll('pdf_descriptions') as string[];
    
    for (let i = 0; i < pdfFiles.length; i++) {
      const file = pdfFiles[i];
      if (file && file.type === 'application/pdf') {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const timestamp = Date.now();
        const filename = `pdf_${timestamp}_${i}.pdf`;
        const filepath = join(uploadsDir, filename);
        
        await writeFile(filepath, buffer);
        
        pdfs.push({
          src: `/uploads/${filename}`,
          title: pdfTitles[i] || file.name.replace('.pdf', ''),
          description: pdfDescriptions[i] || ''
        });
      }
    }

    return NextResponse.json({
      success: true,
      images,
      pdfs
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}