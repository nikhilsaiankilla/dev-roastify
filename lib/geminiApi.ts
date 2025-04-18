import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyAl4xo95gXBz7uqKIoJHuujBPxbSZzmpGw" });

export async function geminiRoastUser(data: any) {
    const { user, recentRepo, lastPushDate } = data;

    // Prepare the input for Gemini API
    // Prepare the input for Gemini API
    const formattedDate = new Date(lastPushDate).toLocaleDateString('en-GB');

    const prompt = `
    Generate a fun, spicy, and lighthearted roast for a GitHub user based on the following data:
    
    User Data:
    {
      "user": {
        "login": "${user.login}",
        "name": "${user.name}",
        "bio": "${user.bio}",
        "avatar_url": "${user.avatar_url}",
        "public_repos": "${user.public_repos}",
        "followers": "${user.followers}",
        "following": "${user.following}",
        "stars": "${user.stars}",
        "location": "${user?.location}"
      },
      "recentRepo": {
        "name": "${recentRepo?.name}",
        "html_url": "${recentRepo?.html_url}",
        "description": "${recentRepo?.description}",
        "language": "${recentRepo?.language}",
        "topics": "${recentRepo?.topics}",
        "commitMessages": "${recentRepo?.commitMessages?.join(', ')}",
        "readmePreview": "${recentRepo?.readmePreview}"
      },
      "lastPushDate": "${formattedDate}"
    }
    
    Roast Guidelines:
    1. **No appreciation for inactivity**: If there’s no recent repo activity, minimal repos, low followers, or lack of stars, skip praise and go straight to roasting.
    2. **Roast them lightheartedly**: Poke fun at their commit messages, bio, repo activity, or inactivity. If anything is missing (null), creatively make fun of it.
    3. **Use pop culture, tech culture, memes, and global events**: Like COVID-19 lockdown, meme trends, internet jokes, classic sayings, viral moments.
    4. **No quotes around "null" values**: Treat them as if the data is just absent, and roast accordingly.
    5. **Date Format**: Always show "lastPushDate" in **dd/mm/yyyy** format only — regardless of timezone or locale.
    6. **Roast Structure**:
        - Start with a punchy intro using the user’s GitHub data.
        - Use spicy humor, not appreciation.
        - Mention things like inactivity, repeated commit messages, weak bios, or empty README.
        - End with a roast rating and spice level.
    
    Spice Level Scale:
    - **Mild (0–30)**: Light teasing.
    - **Medium (31–60)**: Snappy and clever.
    - **Hot (61–80)**: Sassy with strong jabs.
    - **Extra Spicy (81–100)**: Savage roast with confident swagger.
    
    ---
    
    Example Style:
    "Hey, ${user.login}, your GitHub profile looks like it survived the Ice Age and decided to take another break. With ${user.public_repos} repos and a last push on ${formattedDate}, I’ve seen abandoned shopping carts with more updates. Commit messages that read like ‘Update README’? That’s not committing, that’s whispering."
    
    Spice Level: 89/100 🌶️🌶️🌶️🌶️ (Extra Spicy) – Bringing the heat like a production server crash on Friday evening.
    
    ---
    
    Generate a unique roast every time, using the data as your playground. No mercy, just memes, spice, and sarcasm.
    `;



    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        return {
            success: true,
            message: "Roast generated successfully",
            data: {
                roastMessage: response.text,
            },
        };

    } catch (error: unknown) {
        console.error("Error generating roast:", error);
        return {
            success: false,
            message: "Failed to generate roast",
            data: null,
        };
    }
}
