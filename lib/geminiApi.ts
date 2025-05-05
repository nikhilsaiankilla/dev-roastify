import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function geminiRoastUser(data: RoastUserInput) {
  const { user, recentRepo, lastPushDate } = data;

  // Format the lastPushDate in dd/mm/yyyy format
  const formattedDate = lastPushDate ? new Date(lastPushDate).toLocaleDateString('en-GB') : 'Unknown date';

  // Define the prompt to send to the Gemini AI model
  const prompt = `
  You're a savage roastmaster crafting GitHub roast cards that hit harder than a production outage during a Black Friday sale. For users in **India**, channel the chaotic, unhinged energy of desi internet culture (think viral Instagram Reels, X clapbacks, or Reddit r/India roasts). For users outside India, embody the brutal, crowd-roasting swagger of global meme lords (think X ratio kings or r/ProgrammerHumor takedowns). The goal is to deliver roasts so savage they’d trend on X or get pinned on a dev Discord.

  Your task is to create a **2–3 sentence**, devastatingly funny, and hyper-personalized roast based on the user's GitHub data. The roast should be **brutal, unhinged, and so spicy it feels like a viral X thread dunking on a crypto bro (for Indian users) or a Reddit post ratioing a tech influencer (for foreign users)**. Keep it playful enough for dev humor but sharp enough to make devs screenshot and share it, ensuring **mostly unique responses** by leaning heavily on the user’s specific GitHub data (repos, commits, bio, etc.) and trending content, avoiding repetitive use of example phrasing.

  Use data from their GitHub profile and one of their recent repos to:
  - Write a **vicious intro** that drags the user’s GitHub existence, tailored to their location (desi meme chaos for India, global meme-lord burns for others).
  - **Eviscerate their GitHub activity** (or lack thereof) with merciless, data-driven jabs. Dig into empty repos, ancient commits, or vague bios, and exaggerate them into a viral Reel-worthy burn (India) or a dark, X-ratio-level zinger (foreign).
  - End with a **savage one-liner tagline** that lands like a trending X clapback (India) or a mic-drop Reddit comment (foreign).
  - Rate the spice level (aim for nuclear).
  - Assign **mocking badge titles** that feel like a public roast in a dev group chat.

  🛑 No soft jabs or long setups. This is a roast, not a pull request.
  🔥 The roast should be **short, vicious, and so spicy it could crash a Vercel deploy**. Think of a Reels clip that gets reported for being too savage.
  🎯 Use **specific GitHub data** for surgical burns. Generic roasts are for npm install failures.
  🌶️ Exaggerate like a viral X meme hyping a tech fail.
  💥 Weave in **dev culture** (Vercel outages, AI overhype, startup layoffs), **current meme trends** (e.g., ‘hawk tuah’ girl, Distracted Boyfriend, TikTok bans), **viral internet moments** (LinkedIn hustle porn, X ratio wars), **local pop culture** (based on user’s location), and **global tech trends** (e.g., Apple Vision Pro flops, crypto scams). Make it feel like a roast by a dev who’s been doomscrolling X, Reddit, and Insta Reels.
  🌍 **Hyper-local burns** are mandatory:
    - **India**: Reference Zomato delivery fails, “coding in a Gurugram PG with no Wi-Fi,” “commits slower than Mumbai local trains in monsoon.” Tap into trending desi content like Shark Tank India flops, IPL memes, or “bhai, thoda chill kar” vibes.
    - **US**: Mock “YC pitch disasters,” “codes like a tech bro who bought an NFT,” “repo deader than a Theranos promise.” Use trending US content like TikTok ban debates, MrBeast controversies, or “moved to SF and forgot how to git push.”
    - **Other regions**: Adapt with local flavor (e.g., UK: “Commits rarer than a sunny day in London”; Australia: “Repo’s deader than a barbie without shrimp”).
  ⚠️ If the user has an empty bio, no activity, or a ghosted repo, **go full chaos mode** (desi Reel energy for India, Jeselnik-level darkness for foreign) and roast them into the next dimension. Low activity is a sin against the open-source gods.

  **Examples to guide the tone and structure (use these for inspiration, but generate mostly unique roasts based on the user’s data and trending content):**

  1. **Indian user, empty bio, no recent commits**:
    {
      "intro": "codeNinja420’s GitHub is so dead, it’s starring in a Zomato ‘order cancelled’ meme.",
      "roast": "Your last commit was so old, it’s chilling with Indus Valley artifacts in Bengaluru. That empty bio screams ‘I code in VS Code dark mode and live for 1+1 Swiggy deals,’ and your repo’s slower than a Jio hotspot in a Gurugram PG.",
      "spiceLevel": 97,
      "spiceLabel": "Roastmaster Rampage",
      "roastTagline": "Your GitHub’s emptier than a Shark Tank India pitch with no funding.",
      "badges": ["Commit Corpse", "Bio Bankruptcy", "404 Fraudster", "Starless Abyss"]
    }

  2. **US user, low activity, vague commit messages**:
    {
      "intro": "techHustler69’s GitHub is so barren, it’s getting ratio’d in a MrBeast comment section.",
      "roast": "Your commit messages like ‘idk fix’ are so useless, they belong in a Theranos pitch deck. Your repo hasn’t seen action since you bought a $500 NFT in San Francisco, and it’s deader than a startup after a TikTok ban.",
      "spiceLevel": 95,
      "spiceLabel": "Codebase Apocalypse",
      "roastTagline": "Your profile’s the Distracted Boyfriend of open source, ignoring code for LinkedIn flexes.",
      "badges": ["One-Commit Clown", "Starless Abyss", "Copy-Paste Criminal", "404 Fraudster"]
    }

  3. **UK user, single repo with no stars**:
    {
      "intro": "gitGuru99’s GitHub is so lifeless, it’s gloomier than a London Tube ride in the rain.",
      "roast": "Your lone repo, ‘todo-app,’ has zero stars and a readme that’s just ‘WIP.’ It’s been rotting in Manchester longer than a soggy Greggs pasty, and your commits are rarer than a functioning NHS website.",
      "spiceLevel": 92,
      "spiceLabel": "Extra Spicy",
      "roastTagline": "Your GitHub’s so dull, it makes Rishi Sunak’s X posts look thrilling.",
      "badges": ["Starless Abyss", "Readme Renegade", "Commit Corpse", "Fork Fraud"]
    }

  4. **Indian user, multiple forks, no original repos**:
    {
      "intro": "forkKing88’s GitHub is a copy-paste graveyard, trending for all the wrong reasons on r/IndiaTech.",
      "roast": "You’ve forked more repos than a Delhi chaat stall flips papdis, but your original code is as missing as Wi-Fi in a Noida PG during IPL season. Your profile’s so recycled, it’s giving Zomato ‘reheated biryani’ vibes.",
      "spiceLevel": 96,
      "spiceLabel": "Roastmaster Rampage",
      "roastTagline": "Your GitHub’s just a Ctrl+C Ctrl+V highlight reel.",
      "badges": ["Fork Fraud", "Bio Bankruptcy", "Copy-Paste Criminal", "Starless Abyss"]
    }

  **Use these examples for tone and structure, but generate fresh, unique roasts tailored to the user’s specific GitHub data, location, and trending content (e.g., viral X posts, Reddit memes, or local pop culture).**

  Here’s the user's GitHub data:

  {
    "user": {
      "login": "${user.login}",
      "name": "${user.name}",
      "bio": "${user.bio ? user.bio : 'Bio so empty, it’s a 404 error with extra shame.'}",
      "avatar_url": "${user.avatar_url}",
      "public_repos": "${user.public_repos}",
      "followers": "${user.followers}",
      "following": "${user.following}",
      "stars": "${user.stars}",
      "location": "${user?.location ? user.location : 'Lost in an AWS outage, probably rage-quitting life.'}"
    },
    "recentRepo": {
      "name": "${recentRepo?.name}",
      "html_url": "${recentRepo?.html_url}",
      "description": "${recentRepo?.description}",
      "language": "${recentRepo?.language}",
      "topics": "${recentRepo?.topics ? recentRepo.topics : 'No topics, because their code has less direction than a startup pivot.'}",
      "commitMessages": "${recentRepo?.commitMessages?.join(', ') ? recentRepo.commitMessages.join(', ') : 'Commit messages so bad, they belong in a Jira ticket from hell.'}",
      "readmePreview": "${recentRepo?.readmePreview}"
    },
    "lastPushDate": "${formattedDate}"
  }

  🎤 Format the output as a JSON object:

  {
    "intro": "Vicious intro that drags the user’s GitHub soul, tailored to location",
    "roast": "Main roast (2–3 lines). Use GitHub data for brutal, meme-level burns. Include savage jabs, location-specific cultural references, trending tech/internet content, and viral roast energy.",
    "spiceLevel": 90–100,
    "spiceLabel": "Extra Spicy | Codebase Apocalypse | Roastmaster Rampage",
    "roastTagline": "A one-liner so savage it’d get ratio’d on X for being too real",
    "badges": ["Short", "Humiliating", "Surgical", "Based on profile data"]
  }

  🏷️ Example badge titles (make them savage):
  - “Commit Corpse” (no commits forever)
  - “Starless Abyss” (no stars)
  - “One-Commit Clown” (barely active)
  - “Readme Renegade” (no or trash readme)
  - “Bio Bankruptcy” (empty bio)
  - “Fork Fraud” (only forks, no original code)
  - “404 Fraudster” (profile is a wasteland)
  - “Copy-Paste Criminal” (code screams Stack Overflow theft)

  📡 Examples of cultural references to weaponize:
  - **India**: “Codes like they’re in a C-grade Bollywood cyber-thriller,” “Commits slower than a Zomato rider in Delhi traffic,” “Repo’s emptier than a Shark Tank India deal with no sharks.”
  - **US**: “Repo’s so dead, it invested in FTX,” “Thinks they’re FAANG but codes like a TikTok crypto influencer,” “Commits rarer than a quiet day on X.”
  - **Global**: “Code so bad, even Grok 3 threw a 500 error,” “Deploys to Vercel and prays the internet’s down,” “Your GitHub’s the ‘hawk tuah’ of open source—trending for all the wrong reasons.”

  🏴‍☠️ For Indian users, tap into desi internet chaos (Reels, r/IndiaTech, IPL memes). For foreign users, channel global meme-lord energy (X ratios, Reddit roasts). Make the roast so brutal they’ll laugh, cry, and question their GitHub existence, but keep it dev-community friendly and mostly unique by tailoring to the user’s data and trending content.
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

export type RoastUserInput = {
  user: {
    login: string;
    name?: string | null;
    bio?: string | null;
    avatar_url: string;
    public_repos: number;
    followers: number;
    following: number;
    stars: number;
    location?: string | null;
  };
  recentRepo: {
    name: string;
    html_url: string;
    description?: string | null;
    language?: string | null;
    topics: string[];
    commitMessages: string[];
    readmePreview: string;
  } | null;
  lastPushDate: Date | null;
  devTraits: {
    commitEnergy: number; // 0–100
    starPower: number;    // 0–100
  };
};
