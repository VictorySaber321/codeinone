import { NextResponse } from 'next/server';
import { generateWithGemini } from '@/lib/gemini';

export async function POST(request) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured in environment variables' },
        { status: 500 }
      );
    }

    const { code, language } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const prompt = `You are an expert senior software engineer conducting a thorough code review. 

REQUIREMENTS:
1. Analyze the following ${language} code critically
2. Identify bugs, security vulnerabilities, and performance issues
3. Suggest specific improvements with code examples
4. Evaluate code style, readability, and maintainability
5. Check for best practices and modern patterns
6. Provide actionable recommendations

CODE TO REVIEW:
\`\`\`${language}
${code}
\`\`\`

FORMAT YOUR RESPONSE AS:
# Code Review Analysis
## 🎯 Strengths
- [List positive aspects]
## ⚠️ Critical Issues
- [List serious bugs/security issues with severity levels]
## 🔧 Improvements Needed
- [List specific improvements with code examples]
## 🛡️ Security Assessment
- [Security vulnerabilities and fixes]
## 🚀 Performance Optimization
- [Performance issues and solutions]
## 📝 Code Quality
- [Readability, maintainability, style issues]
## 💡 Recommendations
- [Actionable next steps]`;

    console.log('Sending code review request to Gemini...');
    const review = await generateWithGemini(prompt);
    console.log('Gemini code review completed successfully');
    
    return NextResponse.json({ review });

  } catch (error) {
    console.error('Review generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate review: ' + error.message,
        details: 'Check your Gemini API key and network connection'
      },
      { status: 500 }
    );
  }
}