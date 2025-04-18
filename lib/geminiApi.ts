import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyAl4xo95gXBz7uqKIoJHuujBPxbSZzmpGw" });

export async function geminiRoastUser(data: any) {
    const { user, recentRepo, lastPushDate } = data;

    // Format the lastPushDate in dd/mm/yyyy format
    const formattedDate = new Date(lastPushDate).toLocaleDateString('en-GB');

    // Define the prompt to send to the Gemini AI model
    const prompt = `
    Generate a fun, spicy, and lighthearted roast for a GitHub user based on the following data.

    User Data:
    {
      "user": {
        "login": "${user.login}",
        "name": "${user.name}",
        "bio": "${user.bio ? user.bio : 'Your bio is as empty as streets in COVID.'}",
        "avatar_url": "${user.avatar_url}",
        "public_repos": "${user.public_repos}",
        "followers": "${user.followers}",
        "following": "${user.following}",
        "stars": "${user.stars}",
        "location": "${user?.location ? user.location : 'Your location? Probably nowhere near GitHub.'}"
      },
      "recentRepo": {
        "name": "${recentRepo?.name}",
        "html_url": "${recentRepo?.html_url}",
        "description": "${recentRepo?.description}",
        "language": "${recentRepo?.language}",
        "topics": "${recentRepo?.topics ? recentRepo.topics : 'No topics? Did you even try, bro?'}",
        "commitMessages": "${recentRepo?.commitMessages?.join(', ') ? recentRepo.commitMessages.join(', ') : 'No commits. Not even a hello world.'}",
        "readmePreview": "${recentRepo?.readmePreview}"
      },
      "lastPushDate": "${formattedDate}"
    }

    ⚠️ Roast Instructions:
    - No praising inactivity — if the user has low activity, low stars, or weak profile data, roast them harder.
    - Use humor from tech culture, internet memes, movie references, TV shows, and any pop culture material.
    - If something is missing (like no bio or topics), call it out sarcastically.
    - Do **not** wrap null values in quotes — treat them as if the info is just absent.
    - Date format must be **dd/mm/yyyy**.

    🎬 **Movie & Pop Culture Reference Roast Variations**:
    - **Public Repos**: 
      - "With ${user.public_repos} repos, you’re the *Zack Snyder’s Justice League* of GitHub: *long*, *complicated*, and nobody asked for it."
      - "You’ve got ${user.public_repos} repos? That's the *Christopher Nolan* trilogy of GitHub. Confusing, but you know there’s some hidden meaning in there…"
      - "With ${user.public_repos} repos, you’re like the *Matrix Revolutions* of GitHub — full of potential, but *still* nobody’s quite sure what’s going on."
      - "Oh ${user.public_repos} repos? That’s more like *The Hobbit* — *a bit too long* and you’re not sure why it’s a series."
      - "Your repos? *Sonic the Hedgehog* — fast, but no one really knows what they’re about."
      - "You’ve got ${user.public_repos} repos? I mean, *Twilight* had more impact, and that’s saying something."
      - "With ${user.public_repos} repos, you might be the *M. Night Shyamalan* of GitHub — nobody understands what’s going on, but we’re all waiting for the twist."
    - **Followers**: 
      - "Only ${user.followers} followers? You’re the *Ghostbusters* of GitHub — nobody’s following you, but you’re just *kinda* there."
      - "With ${user.followers} followers, I’d say you’re *Deadpool* – a cult classic, but a little too much for mainstream success."
      - "Only ${user.followers}? Seems like you’re the *The Walking Dead* of GitHub — no one’s talking, but you’re still hanging around."
      - "You’ve got ${user.followers}? Must be a *Matrix* thing — you’re there, but not quite real to anyone."
      - "Your followers are so few, you’re the *Firefly* of GitHub. Everyone’s heard of it, but nobody knows why it got canceled."
      - "Only ${user.followers}? You’re basically the *Willy Wonka* of GitHub — quirky, but not enough people are buying your chocolate."
      - "With ${user.followers}, you’re like *Inception* — trying to plant an idea but getting lost somewhere in the dream."
    - **Bio Empty**: 
      - "Your bio is as empty as *The Star Wars Holiday Special*. I mean, did anyone actually *read* it?"
      - "Your bio is blank? It’s like you’re the *The Silence of the Lambs* of GitHub — eerie and mysterious, but we’d like some context!"
      - "A blank bio? You’re basically the *Gandalf* of GitHub — only showing up when necessary, but never giving any details."
      - "Your bio is a blank canvas. Are you *Banksy* or just avoiding saying anything interesting?"
      - "Your bio’s as sparse as the *Hunger Games* plot. At least you’ve got people’s attention, but what happens next?"
      - "That bio’s so blank it could be the *The Twilight Zone* — eerie, uninviting, and nobody’s sure what’s going on."
      - "With a blank bio, you’re basically *Babadook* — hidden, mysterious, and frankly, a little scary."
    - **Username Cringe**: 
      - "Your username ${user.login}? Sounds like you’re a *Star Trek* villain that the crew just can’t seem to shake."
      - "Is your username ${user.login} or a typo from *Lord of the Rings*? Either way, we’re all wondering what’s going on."
      - "Is your username ${user.login} or did you just mash your keyboard and hit ‘enter’? Like a *Minecraft* villager name!"
      - "Your username sounds like something out of *Transformers* — but you forgot to transform into something cool."
      - "That username? Are you sure you’re not the *Doctor Who* of GitHub? We’re all still trying to figure out who you are."
      - "Your username ${user.login}? Sounds like something that came out of a *Star Wars* fanfic that didn’t make it past the first draft."
      - "Is your username ${user.login} or an unfinished title for the next *Avengers* movie?"
    - **Commit Messages**: 
      - "Your commits are as quiet as *The Quiet Place* — honestly, were you even coding or just typing in your sleep?"
      - "Those commit messages? They’ve got more mystery than *Twin Peaks*. We’re all wondering what you were *really* trying to say."
      - "Your commit messages are like *Inception* — we’re all still trying to figure out what’s real and what’s just a dream."
      - "Commit messages as vague as the *Lost* finale. We’re all trying to piece together what actually happened here."
      - "Your commit messages are like *The Matrix* — sometimes you need to be told that you're just seeing green code and not the real world."
      - "Your commit messages? They’re basically the *Breaking Bad* of GitHub — suspenseful, but completely cryptic."
      - "Commit messages like *The Witcher* timeline — confusing and tough to follow, but somehow intriguing."
    - **Low Stars**: 
      - "Stars? What are those? Your repos have less shine than *Twilight* — except you’re missing the fanbase too."
      - "You’ve got fewer stars than *Star Wars: The Phantom Menace*. It had potential, but nobody really got it."
      - "Stars? You’ve got fewer than *Harry Potter and the Chamber of Secrets* has plot holes — and that’s saying something!"
      - "You’ve got fewer stars than *Avengers: Endgame* had spoilers — I mean, come on, you’re leaving us all hanging."
      - "You’ve got fewer stars than *The Matrix Reloaded* has plot twists. At least you’re consistent with confusion."
      - "You’ve got fewer stars than *Justice League* in its first cut. But hey, *Snyder Cut* coming soon?"
      - "Stars? Less than *The Last Jedi*. You tried, but you didn’t quite nail it."
      

    🎮 **Location-based Humor**:
    - If **location** is available: 
      - "Ah, ${user.location}, home of *the best coffee* and the worst repo names."
      - "Living in ${user.location}? So you're the *Sherlock Holmes* of GitHub, solving mysteries… of bad code."
      - "Ah, ${user.location}, where even the bugs in your code seem to take vacation days."
      - "From ${user.location}, huh? You must be the *Indiana Jones* of GitHub — looking for ancient repo relics, but not finding any."
    - If **location** is **not available**: 
      - "Your location? *Mission Impossible* to figure out, because you’re clearly avoiding the spotlight."
      - "You’re located in a *Matrix* of no data — is this even real or are we all in the simulation?"
      - "Your location’s like your repo history — *incomplete*, and we’re still waiting for the next big reveal."
      - "You’ve got no location? You’re the *Doctor Strange* of GitHub, hopping across dimensions without telling us where you are."

      **Personalized Humor Based on User Data**:
    - **No Topics**: 
      - "No topics on your repo? *The Room* of GitHub — nobody really knows what happened, but it’s kind of a legend."
      - "No topics? Did you just leave it as an Easter egg for us to *discover*? We’ll pretend we understand."
    - **Missing Info**: 
      - "You’ve got ${user.public_repos} repos and ${user.followers} followers? At least you’re good at being a ghost on GitHub."
      - "With ${user.followers} followers, you’re like *The Invisible Man* of GitHub. Except, no one really wants to see you."
    - **Low Stars**: 
      - "You’ve got fewer stars than *Hogwarts* at night, but at least you’re part of the wizarding world… right?"
      - "You’ve got fewer stars than *Indiana Jones and the Kingdom of the Crystal Skull* — people talk about it, but nobody gets why it exists."
    - **Username Uninspired**: 
      - "Your username ${user.login}? You sound like a *Matrix* extra who forgot their lines."
      - "You’re ${user.login}? Are you secretly a *Stranger Things* character hiding from the Demogorgon?"

    🏷️ **Badge Instructions**:
    In addition to the roast, generate a \`badges\` array with up to **4 - 5 short, roast-style** strings based on the user's GitHub behavior. These are sarcastic, spicy, meme-worthy titles — like mini awards for underwhelming habits. Keep them short (1–2 words) and spicy.

    Only assign badges if the user's data supports it — do not generate random ones.

    Examples:
    - "Commit Ghost" — commits rarely or not at all
    - "Starless" — has few or zero stars
    - "Bio Blank" — has no bio
    - "Readme Rookie" — missing or weak README
    - "Fork Lord" — mostly forks, no original work
    - "404 Dev" — profile missing key info (bio, location, etc)
    - "Push Dodger" — last push was ages ago
    - "HelloWorld Pro" — only beginner-level repos
    - "Syntax Sorcerer" — strange or cryptic commit messages
    - "Snack Committer" — commits once every snack break
    - "Theme Switcher" — cares more about themes than code
    - "WIP Warrior" — lots of unfinished/inactive projects
    
    📌 Format your output strictly in **JSON** with these keys:
    1. **intro**: A short, punchy intro referencing the user’s GitHub stats (string).
    2. **roast**: A spicy roast of 2-4 lines, roasting their activity, commit messages, repos, or bio (string).
    3. **spiceLevel**: A number (0–100), representing the intensity of the roast.
    4. **spiceLabel**: A string describing the spice level:
       - 0–30: "Mild"
       - 31–60: "Medium"
       - 61–80: "Hot"
       - 81–100: "Extra Spicy"
    5. **roastTagline**: A witty, meme-worthy tagline ending the roast (string).
    6. **badges**: An array of up to 4 to 5 short badge strings (string[])

    Output Example (strict JSON):

    {
      "intro": "Hey ${user.login}, your GitHub profile is like the forgotten draft of a broken app — untouched and gathering digital dust.",
      "roast": "With ${user.public_repos} repos and your last push on ${formattedDate}, you haven’t contributed more than a cat video on Twitter. Your bio? Feels like an AI template with zero customization. Your commit messages are what I call 'whisper commits' — no one's hearing them.",
      "spiceLevel": 85,
      "spiceLabel": "Extra Spicy",
      "roastTagline": "Bringing the heat like a production server crash on Friday night."
      "badges": ["Commit Ghost", "Bio Blank", "Snack Committer"]
    }

    🔥 **Personalized Humor Based on User Data**:
    - **No Topics**: 
      - "No topics on your repo? *The Room* of GitHub — nobody really knows what happened, but it’s kind of a legend."
      - "No topics? Did you just leave it as an Easter egg for us to *discover*? We’ll pretend we understand."
    - **Missing Info**: 
      - "You’ve got ${user.public_repos} repos and ${user.followers} followers? At least you’re good at being a ghost on GitHub."
      - "With ${user.followers} followers, you’re like *The Invisible Man* of GitHub. Except, no one really wants to see you."
    - **Low Stars**: 
      - "You’ve got fewer stars than *Hogwarts* at night, but at least you’re part of the wizarding world… right?"
      - "You’ve got fewer stars than *Indiana Jones and the Kingdom of the Crystal Skull* — people talk about it, but nobody gets why it exists."
    - **Username Uninspired**: 
      - "Your username ${user.login}? You sound like a *Matrix* extra who forgot their lines."
      - "You’re ${user.login}? Are you secretly a *Stranger Things* character hiding from the Demogorgon?"

    Spice it up! Personalize the roast with a mix of clever references to movies, memes, personal traits like their cringy username, their bio, and their location (if available). Keep it unpredictable and fun!
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
