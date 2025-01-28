import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest } from "next/server";

export async function POST(request:NextRequest){
  // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const genAI = new GoogleGenerativeAI('AIzaSyAlLj7tP7RpSNcKthiqmmT51jB_UXyVYV8');

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const prompt =  "Create a list of Four open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return Response.json(
      {success:true,message:result.response.text()},
      {status:201}
  )
  } catch (error:any) {
    console.log(error)
    return Response.json(
      {success:true,message:error.message},
      {status:201}
  )
  }

}
