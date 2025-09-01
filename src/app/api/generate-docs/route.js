import { NextResponse } from 'next/server';
import { generateWithGemini } from '@/lib/gemini';

export async function POST(request) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const { code, language } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const prompt = `You are an expert programmer. Generate comprehensive documentation for the following ${language} code. 
    Include a description, parameter explanations, return value explanation, and any important notes.

    Code:
    ${code}

    Documentation:`;

    console.log('Sending request to Gemini...');
    const documentation = await generateWithGemini(prompt);
    console.log('Gemini response received successfully');
    
    return NextResponse.json({ documentation });

  } catch (error) {
    console.error('AI Documentation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate documentation: ' + error.message },
      { status: 500 }
    );
  }
}