import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const orderId = formData.get('orderId') as string;

    if (!file || !orderId) {
      return NextResponse.json(
        { error: 'File and orderId are required' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images and PDFs allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-z0-9.-]/gi, '_');
    const filename = `proof-${orderId}-${timestamp}-${sanitizedName}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    const publicPath = `/uploads/${filename}`;

    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));

    return NextResponse.json({
      success: true,
      file: {
        name: filename,
        path: publicPath,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
