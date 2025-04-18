const prompt = `
Generate a fun, spicy, and lighthearted roast for a GitHub user based on the following data:

User Data:
{
    "user": {
        "login": "{user.login}",
        "name": "{user.name}",
        "bio": "{user.bio}",
        "avatar_url": "{user.avatar_url}",
        "public_repos": "{user.public_repos}",
        "followers": "{user.followers}",
        "following": "{user.following}",
        "stars": "{user.stars}"
    },
    "recentRepo": {
        "name": "{recentRepo.name}",
        "html_url": "{recentRepo.html_url}",
        "description": "{recentRepo.description}",
        "language": "{recentRepo.language}",
        "topics": "{recentRepo.topics}",
        "commitMessages": "{recentRepo.commitMessages}",
        "readmePreview": "{recentRepo.readmePreview}"
    },
    "lastPushDate": "{lastPushDate}"
}

Roast Guidelines:
1. **No appreciation for the user if they don't deserve it**: If there’s no recent repo activity, minimal repos, low followers, or lack of stars, skip the appreciation.
2. **Roast them lightheartedly**: Poke fun at their commit messages, bio, repo activity, or inactivity. If there’s no activity, make fun of the "ghost town" vibe of their profile.
3. **Add fun, tech-specific jabs**: Reference GitHub-specific culture (commit messages, repo names, etc.).
4. **Spice Level**: Rate the roast’s intensity from 0-100 and indicate whether it’s mild, medium, hot, or extra spicy.

Output Format:

Roast Example (No Appreciation):
"Hey, {user.login}, your GitHub is looking more like a 'coming soon' page than an active developer profile. {user.followers} followers? I bet they’re just here to watch you sleep on your repos! And what's with that bio—‘I code’? That’s it? Maybe you should add ‘I nap’ to give us a full picture. No commits since {lastPushDate}? I think even your keyboard’s giving up on you at this point. Let’s hope {recentRepo.name} isn’t a metaphor for how much you’re actually coding. 🚀"

Spice Level: 75/100 🌶️🌶️🌶️🌶️ (Hot) – A spicy roast for your quiet GitHub profile with a dash of ‘wake-up-and-code’ sass!

---

Detailed Instructions:
1. **No Appreciation for Inactivity**: If the user has minimal repos, low followers, or hasn’t pushed code recently, skip praise and go straight to roasting.
2. **Roast Elements**: 
   - Playfully mock inactivity, lack of contributions, vague or nonexistent commit messages, and an empty or minimal bio.
   - Tease them about not updating repos or their profile (e.g., "Your GitHub is practically a ghost town").
   - If the last commit was ages ago, you could say something like: "Your last push was in the Stone Age, huh?"
3. **Spice Level**: Assign a spice level out of 100, with ratings such as:
   - **Mild (0-30)**: Light, playful teasing with minimal sass.
   - **Medium (31-60)**: Moderate roast with clever commentary on GitHub habits.
   - **Hot (61-80)**: Sassy and sharp jabs, but still friendly.
   - **Extra Spicy (81-100)**: Bold and daring roast, turning the spotlight on the entire GitHub vibe.

---

Roast Example with No Appreciation:
"Wow, {user.login}, your GitHub is like a digital museum. Not much happening here—{user.followers} followers, but no repos to show for it? What is this, a 'look but don’t touch' situation? Your bio is 'I code'—well, you could have fooled us! And what’s the deal with that last push? {lastPushDate}?! Your repo’s more of a crypt than a coding hub. Time to dust off those keyboards!"

Spice Level: 85/100 🌶️🌶️🌶️🌶️ (Extra Spicy) – Roasting you with full heat for that ghost town of a profile!

---

Customization:
- If the user has little to no activity, shift the focus to humorously highlighting their inactivity or lack of contributions.
- Use dynamic data like \`user.login\`, \`user.public_repos\`, \`recentRepo.name\`, etc., to create a tailored, humorous roast.
- Adjust the roast tone based on the activity level to make it either mildly playful or extra spicy.

`;

export default prompt;
