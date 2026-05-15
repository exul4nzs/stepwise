import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const { systemPrompt, userMessage } = await req.json();
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { text: "", error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Based on ListModels diagnostic, we use gemini-flash-latest
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    // Attempt one last desperate fallback to 1.5-flash if pro failed
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
        const result = await model.generateContent(`${systemPrompt}\n\n${userMessage}`);
        const response = await result.response;
        return NextResponse.json({ text: response.text() });
    } catch (innerError: any) {
        return NextResponse.json(
            { text: "", error: `Gemini API failed: ${error.message}. Fallback also failed: ${innerError.message}` },
            { status: 502 }
        );
    }

    return NextResponse.json(
      { text: "", error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
