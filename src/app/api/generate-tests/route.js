
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { code } = await req.json();

    if (!code || code.trim() === "") {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an AI code tester. 
Return ONLY valid JSON, no explanations, no markdown. Format strictly as:
{
  "language": "detected language",
  "tests": "test code as string",
  "testResults": {
    "allPassed": boolean,
    "total": number,
    "passed": number,
    "failed": number,
    "details": [
      { "name": "test name", "passed": boolean, "error": "if any" }
    ]
  }
}

Code:
\`\`\`
${code}
\`\`\`
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // ✅ Extract only JSON block (ignore extra markdown or explanations)
    const match = responseText.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json(
        { error: "AI did not return valid JSON", raw: responseText },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(match[0]); // Parse only JSON part
    } catch (err) {
      console.error("Parse error:", err, "Raw:", responseText);
      return NextResponse.json(
        { error: "Failed to parse AI JSON", raw: responseText },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate tests" },
      { status: 500 }
    );
  }
}
