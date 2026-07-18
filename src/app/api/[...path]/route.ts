import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://sidhivinayakevents.onrender.com';

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const resolvedParams = await params;
    const pathStr = resolvedParams.path.join('/');
    const url = new URL(req.url);
    const targetUrl = `${BACKEND_URL.replace(/\/+$/, '')}/api/${pathStr}${url.search}`;

    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      if (key !== 'host' && key !== 'content-length') {
        headers[key] = value;
      }
    });

    let body: any = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const arrBuf = await req.arrayBuffer();
      if (arrBuf.byteLength > 0) {
        body = Buffer.from(arrBuf);
      }
    }

    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: 'no-store',
      // @ts-ignore
      duplex: 'half',
    });

    const data = await backendRes.arrayBuffer();
    const resHeaders: Record<string, string> = {};
    backendRes.headers.forEach((value, key) => {
      resHeaders[key] = value;
    });

    return new NextResponse(data, {
      status: backendRes.status,
      headers: resHeaders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Proxy error' }, { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
export const OPTIONS = handleProxy;
