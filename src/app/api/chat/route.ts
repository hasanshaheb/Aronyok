import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { fallbackSettings } from "@/lib/supabase/fallback-data";

// Fallback intelligent natural herbal answers for demo mode if no OpenRouter key is set
function getBotanicalDemoResponse(query: string, lang: string): string {
  const q = query.toLowerCase();

  if (lang === "bn" || /[\u0980-\u09FF]/.test(query)) {
    if (q.includes("তুলসী") || q.includes("সর্দি") || q.includes("কাশি")) {
      return "তুলসী (কৃষ্ণ তুলসী) সর্দি-কাশি ও শ্বাসকষ্টের জন্য মহৌষধ। ৪-৫টি তাজা তুলসী পাতা এক কাপ পানিতে ফুটিয়ে সামান্য আদা ও খাঁটি মধু মিশিয়ে দিনে দুবার পান করলে দ্রুত উপশম মেলে। আমাদের দোকানে সতেজ কৃষ্ণ তুলসী চারা এবং অর্গানিক তুলসী চা উপলব্ধ রয়েছে।";
    }
    if (q.includes("নিম") || q.includes("পোকা") || q.includes("তেল")) {
      return "নিম তেল একটি চমৎকার প্রাকৃতিক কীটনাশক। প্রতি লিটার হালকা গরম পানিতে ৫ মিলি কোল্ড-প্রেসড নিম তেল ও কয়েক ফোঁটা তরল সাবান মিশিয়ে ভালো করে ঝাঁকিয়ে গাছে স্প্রে করুন। এটি পোকা দূর করে এবং গাছের কোনো ক্ষতি করে না।";
    }
    if (q.includes("মধু") || q.includes("সুন্দরবন")) {
      return "সুন্দরবনের খলিসা ও কেওড়া ফুলের প্রাকৃতিক চাকভাঙা মধু সম্পূর্ণ অপরিশোধিত ও অ্যান্টিঅক্সিডেন্টে ভরপুর। এটি রোগ প্রতিরোধ ক্ষমতা বাড়ায়, হজমে সাহায্য করে এবং প্রাকৃতিক এনার্জি বুস্টার হিসেবে কাজ করে।";
    }
    if (q.includes("পানি") || q.includes("টব") || q.includes("মাটি")) {
      return "টবের গাছে প্রতিদিন অতিরিক্ত পানি না দিয়ে উপরের ১ ইঞ্চি মাটি শুকিয়েছে কিনা আঙুল দিয়ে পরীক্ষা করে পানি দিন। এছাড়া দোআঁশ মাটির সাথে ৩০% কেঁচো সার (ভার্মিকম্পোস্ট) মেশালে গাছের শিকড় চমৎকার পুষ্টি পায়।";
    }
    return "অরণ্যক প্রকৃতি পরামর্শ কেন্দ্রে স্বাগতম। আপনার প্রশ্নটির জন্য ধন্যবাদ! প্রকৃতি ও ভেষজ উপাদানের সঠিক ব্যবহার আমাদের সুস্থ রাখতে অনন্য ভূমিকা রাখে। ভেষজ প্রতিকার, বারান্দার বাগান পরিচর্যা কিংবা অর্গানিক উপাদান নিয়ে আরও নির্দিষ্ট তথ্য চাইলে অনুগ্রহ করে লিখুন।";
  }

  // English fallback
  if (q.includes("tulsi") || q.includes("cold") || q.includes("cough")) {
    return "Tulsi (Holy Basil) is revered in Ayurveda for respiratory comfort. Steep 4-5 fresh leaves with ginger in hot water and sweeten with raw mangrove honey twice daily to soothe a sore throat. We also offer potted live Krishna Tulsi plants in our store!";
  }
  if (q.includes("neem") || q.includes("pest") || q.includes("oil")) {
    return "Cold-pressed neem oil is the gold standard for natural pest deterrence. Mix 5ml of pure neem oil with 1 litre of lukewarm water and 2-3 drops of mild liquid soap. Shake well and spray on foliage early morning or evening to deter aphids and mites.";
  }
  if (q.includes("honey") || q.includes("sundarban")) {
    return "Aronyok's Sundarbans wild honey is harvested ethically from mangrove blooms. It is raw, unfiltered, rich in natural enzymes and floral pollen, which bolster immunity and soothe digestion.";
  }
  if (q.includes("water") || q.includes("soil") || q.includes("pot")) {
    return "For potted herbs, always adhere to the finger-test: water deeply only when the top inch of soil feels dry. Combining garden soil with 30% organic vermicompost ensures aeration and nutrient balance without chemical fertilizers.";
  }

  return "Welcome to Aronyok! Nature holds the gentle remedy for our daily wellness. Please feel free to ask about therapeutic herbs, soil mixing, pest defense, or our organic store items.";
}

export async function POST(req: NextRequest) {
  try {
    const { messages, language = "en" } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Valid messages array is required" },
        { status: 400 }
      );
    }

    const latestUserMessage = messages[messages.length - 1]?.content || "";

    // 1. Fetch dynamic system prompt from Supabase Settings or fallback
    let systemPrompt = fallbackSettings.ai_system_prompt;
    const supabase = getServerSupabase();
    if (supabase) {
      try {
        const { data } = await supabase
          .from("settings")
          .select("ai_system_prompt")
          .limit(1)
          .single();
        if (data?.ai_system_prompt) {
          systemPrompt = data.ai_system_prompt;
        }
      } catch {
        // Fallback used
      }
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const candidateModels = [
      process.env.OPENROUTER_MODEL,
      "google/gemma-4-31b-it:free",
      "google/gemma-4-26b-a4b-it:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "meta-llama/llama-3-8b-instruct:free",
    ].filter(Boolean) as string[];

    // 2. If no API key configured or placeholder, use botanical demo engine
    if (
      !openRouterApiKey ||
      openRouterApiKey === "your-openrouter-api-key" ||
      openRouterApiKey.trim() === ""
    ) {
      const demoReply = getBotanicalDemoResponse(latestUserMessage, language);
      return NextResponse.json({ reply: demoReply, source: "demo-fallback" });
    }

    // 3. Attempt candidates in fallback sequence
    let finalReply = "";
    for (const modelCandidate of candidateModels) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openRouterApiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "X-Title": "Aronyok Nature Assistant",
          },
          body: JSON.stringify({
            model: modelCandidate,
            messages: [
              {
                role: "system",
                content: `${systemPrompt}\nCurrent UI Language: ${language}. Always maintain a calm, gentle, eco-conscious, and expert tone. Format with clear paragraphs or bullet points if helpful.`,
              },
              ...messages,
            ],
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.choices?.[0]?.message?.content) {
            finalReply = data.choices[0].message.content;
            return NextResponse.json({ reply: finalReply, source: `openrouter:${modelCandidate}` });
          }
        } else {
          console.warn(`OpenRouter candidate ${modelCandidate} returned status ${response.status}`);
        }
      } catch (err) {
        console.warn(`Fetch error for ${modelCandidate}:`, err);
      }
    }

    // If all upstream free models are temporarily rate-limited, serve intelligent botanical response
    const demoReply = getBotanicalDemoResponse(latestUserMessage, language);
    return NextResponse.json({ reply: demoReply, source: "botanical-fallback" });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "Nature teaches patience! We encountered a slight delay. Please try your question again.",
        source: "error-catch",
      },
      { status: 200 }
    );
  }
}
