import OpenAI from "openai";
import { getAuth } from "@clerk/nextjs/server";

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export default async function handler(req, res) {
  // Get authenticated user from Clerk
  const { userId } = getAuth(req);

  // Get the query parameters
  const { category = "AI Agents", lang = "en" } = req.query;

  console.log("API received:", {
    category,
    lang,
    userId, // Log which user is making the request
    query: req.query,
  });

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({
      error: "DEEPSEEK_API_KEY environment variable is not set",
    });
  }

  try {
    // Initialize DeepSeek client
    const client = new OpenAI({
      baseURL: DEEPSEEK_BASE_URL,
      apiKey: DEEPSEEK_API_KEY,
    });

    // Category translations for Arabic prompts
    const categoryTranslations = {
      "AI Agents": "وكلاء الذكاء الاصطناعي",
      "E-commerce": "التجارة الإلكترونية",
      Healthcare: "الرعاية الصحية",
      Education: "التعليم",
      Finance: "المالية",
      Entertainment: "الترفيه",
      Productivity: "الإنتاجية",
      "Social Media": "وسائل التواصل الاجتماعي",
    };

    const categoryInArabic = categoryTranslations[category] || category;

    // Create language-specific prompts
    const prompts = {
      en: `Generate a comprehensive business idea for the ${category} industry. Include the following sections:
- Executive Summary
- The Problem
- The Solution
- Target Market
- Revenue Model
- Competitive Advantage
- Next Steps

Make it detailed, actionable, and innovative. Format it as a markdown document with proper headings.`,
      ar: `أجب باللغة العربية فقط. لا تستخدم الإنجليزية أبداً.

أنشئ فكرة عمل شاملة ومبتكرة لصناعة ${categoryInArabic}. اكتب جميع المحتوى باللغة العربية بالكامل.

يجب أن تتضمن الفكرة الأقسام التالية (كل قسم يجب أن يكون باللغة العربية):
- الملخص التنفيذي
- المشكلة
- الحل المقترح
- السوق المستهدف
- نموذج الإيرادات
- الميزة التنافسية
- الخطوات التالية

تذكر: اكتب كل شيء باللغة العربية فقط. قم بتنسيق النص كمستند markdown مع العناوين والتنسيق المناسب.`,
    };

    const prompt = prompts[lang] || prompts.en;

    console.log("Using language:", lang);
    console.log("Using prompt:", prompt.substring(0, 100) + "...");

    // Set headers for streaming response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Call DeepSeek API with streaming
    const stream = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Stream the response
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("DeepSeek API error:", error);
    res.status(500).json({
      error: "Failed to generate business idea",
      details: error.message,
    });
  }
}
