import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'API key not configured on server' },
        { status: 500 }
      );
    }

    const { code, language } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // Initialize OpenAI with the API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `You are an expert programmer. Generate comprehensive documentation for the following ${language} code. 
    Include a description, parameter explanations, return value explanation, and any important notes.

    Code:
    ${code}

    Documentation:`;

    console.log('Sending request to OpenAI with code length:', code.length);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates excellent code documentation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
    });

    console.log('OpenAI response received successfully');
    
    const documentation = completion.choices[0].message.content;
    
    return NextResponse.json({ documentation });

  } catch (error) {
    console.error('AI Documentation error details:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate documentation';
    
    if (error.response) {
      // OpenAI API error
      errorMessage = `OpenAI API error: ${error.response.status} - ${error.response.data.error?.message || 'Unknown error'}`;
    } else if (error.code === 'ENOTFOUND') {
      // Network error
      errorMessage = 'Network error: Cannot connect to OpenAI API';
    } else if (error.message.includes('API key')) {
      // API key error
      errorMessage = 'OpenAI API key issue: Please check your API key';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}