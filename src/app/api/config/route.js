import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const configFilePath = path.join(process.cwd(), 'public', 'config.json');

export async function GET() {
  try {
    console.log(" GET api called /api/config ");
    const data = fs.readFileSync(configFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read config file' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    console.log(" POST api called /api/config ");
    const newData = await req.json();
    fs.writeFileSync(configFilePath, JSON.stringify(newData, null, 2), 'utf8');
    return NextResponse.json({ message: 'Config updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update config file' }, { status: 500 });
  }
}
