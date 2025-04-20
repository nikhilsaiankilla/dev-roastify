import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyAl4xo95gXBz7uqKIoJHuujBPxbSZzmpGw" });

export async function geminiRoastUser(data: any) {
  const { user, recentRepo, lastPushDate } = data;

  // Format the lastPushDate in dd/mm/yyyy format
  const formattedDate = new Date(lastPushDate).toLocaleDateString('en-GB');

  // Define the prompt to send to the Gemini AI model
  const prompt = `
You're a witty, sarcastic roastmaster generating spicy GitHub roast cards.

Your task is to create a short, funny, and personalized roast based on the user's GitHub data. The roast should be 3-4 sentences long, with a tone that is light-hearted, humorous, and teasing — not mean-spirited. Roasts should feel like inside jokes that developers would find hilarious, especially those who hang out on Twitter, Reddit, and GitHub. Use playful jabs based on their activity, repos, or common developer experiences, and keep it impactful and memorable — something that feels like viral material for the dev community.

Use data from their GitHub profile and one of their recent repos to:
- Create a short intro about the user.
- Roast their GitHub activity and habits.
- Add a funny one-liner tagline.
- Rate the spice level.
- Give them funny badge titles based on the roast.

🛑 Avoid long stories or movie-style build-ups.
🔥 The roast should be short, sharp, and spicy. Like a Reels version of a stand-up roast.
🎯 Use specific GitHub data. No generic advice.
🌶️ Feel free to exaggerate and use sarcasm.
💥 Make jokes using dev culture, meme trends, viral internet moments, and both **local pop culture** (based on the user’s location) AND **global tech trends** (like AI, Vercel memes, startup layoffs, etc.).
🌍 Reference the user's location for extra flavor. If they're from India, use Indian movie/OTT jokes. If they're from the US, reference tech bros, YC, or Silicon Valley stuff. Adapt accordingly.
⚠️ If the user has an empty bio, or low activity, roast them harder.

Here’s the user's GitHub data:

{
  "user": {
    "login": "${user.login}",
    "name": "${user.name}",
    "bio": "${user.bio ? user.bio : 'Their bio is as empty as their weekend plans.'}",
    "avatar_url": "${user.avatar_url}",
    "public_repos": "${user.public_repos}",
    "followers": "${user.followers}",
    "following": "${user.following}",
    "stars": "${user.stars}",
    "location": "${user?.location ? user.location : 'Somewhere in the cloud... literally.'}"
  },
  "recentRepo": {
    "name": "${recentRepo?.name}",
    "html_url": "${recentRepo?.html_url}",
    "description": "${recentRepo?.description}",
    "language": "${recentRepo?.language}",
    "topics": "${recentRepo?.topics ? recentRepo.topics : 'No topics. Even ChatGPT’s hallucinations have more focus.'}",
    "commitMessages": "${recentRepo?.commitMessages?.join(', ') ? recentRepo.commitMessages.join(', ') : 'Commit messages? Looks like they’re writing haikus in binary.'}",
    "readmePreview": "${recentRepo?.readmePreview}"
  },
  "lastPushDate": "${formattedDate}"
}

🎤 Format the output as a JSON object:

{
  "intro": "Funny intro about the user",
  "roast": "Main roast (2–4 lines). Use GitHub data. Include spicy jokes, meme-level commentary, cultural references based on the user's location, and recent global tech/internet trends.",
  "spiceLevel": 0–100,
  "spiceLabel": "Mild | Medium | Hot | Extra Spicy",
  "roastTagline": "Final zinger — like a punchy one-liner you’d see on a meme or sticker",
  "badges": ["Short", "Funny", "Descriptive", "Based on profile data"]
}

🏷️ Example badge titles:
- “Commit Ghost” (rarely commits)
- “Starless” (no stars)
- “Snack Committer” (commits once per snack break)
- “WIP Warrior” (lots of unfinished repos)
- “Bio Blank” (no bio)
- “Push Dodger” (last push was prehistoric)
- “404 Dev” (no useful info)
- “Dark Theme Philosopher” (writes more about themes than code)

📡 Examples of cultural references to sprinkle in:
- Indian: RRR, Pushpa, Swiggy memes, Shark Tank India, “Thoda chill kar le bhai”
- US: YC rejections, “Moved to SF once and never touched code again”
- Global: ChatGPT everywhere, “Vercel deploy and pray”, startup layoffs, LinkedIn cringe, AI-generated everything

🏄‍♂️ Let the roast flow naturally. Be creative, but always make it feel like it was written just for them.
`;

  try {
    // Call Gemini API to generate roast content
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // Remove the '```json' code block markers and any other extra content
    const cleanResponseText = (response.text ?? '').replace(/^```json\s*|\s*```$/g, '');

    // Check if the cleaned response contains valid JSON
    let roastData = null;
    if (cleanResponseText) {
      try {
        roastData = JSON.parse(cleanResponseText);
      } catch (parseError) {
        console.error("Error parsing response as JSON:", parseError);
        return {
          success: false,
          message: "Invalid response format from Gemini API",
          data: null,
        };
      }
    }

    // Ensure the response has all the expected fields
    if (
      roastData &&
      roastData.intro &&
      roastData.roast &&
      roastData.spiceLevel != null &&
      roastData.spiceLabel &&
      roastData.roastTagline
    ) {
      return {
        success: true,
        message: "Roast generated successfully",
        data: {
          roastMessage: roastData,
        },
      };
    } else {
      console.error("Incomplete or malformed response:", roastData);
      return {
        success: false,
        message: "Malformed response received from Gemini API",
        data: null,
      };
    }
  } catch (error: unknown) {
    console.error("Error generating roast:", error);
    return {
      success: false,
      message: "Failed to generate roast",
      data: null,
    };
  }
}
