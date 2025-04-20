"use server";

import { geminiRoastUser } from "@/lib/geminiApi";
import { z } from "zod";

const formSchema = z.object({
    githubId: z.string().min(1, "GitHub ID is required"),
});

const GITHUB_HEADERS = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "DevRostify-Agent"
};

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const roastUserAction = async (formData: FormData) => {
    try {
        const parsed = formSchema.safeParse({
            githubId: formData.get("username"),
        });

        if (!parsed.success) {
            return {
                success: false,
                status: 400,
                message: "Invalid GitHub ID",
                data: null,
            };
        }

        const githubId = parsed.data.githubId;

        // Make concurrent API requests to GitHub
        const [userRes, repoRes, eventsRes] = await Promise.all([
            fetch(`https://api.github.com/users/${githubId}`, { headers: GITHUB_HEADERS }),
            fetch(`https://api.github.com/users/${githubId}/repos?sort=updated&per_page=1`, { headers: GITHUB_HEADERS }),
            fetch(`https://api.github.com/users/${githubId}/events/public`, { headers: GITHUB_HEADERS })
        ]);

        // Handle user profile response
        if (!userRes.ok) {
            return {
                success: false,
                status: userRes.status,
                message: "GitHub user not found",
                data: null,
            };
        }
        const user = await userRes.json();

        // Handle repo response
        const repoList = await repoRes.json();
        const repo = repoList?.[0];

        let commitMessages: string[] = [];
        let readmePreview = "";
        let topics: string[] = [];

        if (repo) {
            const [commitsRes, readmeRes, topicsRes] = await Promise.all([
                fetch(`https://api.github.com/repos/${githubId}/${repo.name}/commits?per_page=3`, { headers: GITHUB_HEADERS }),
                fetch(`https://api.github.com/repos/${githubId}/${repo.name}/readme`, { headers: GITHUB_HEADERS }),
                fetch(`https://api.github.com/repos/${githubId}/${repo.name}/topics`, {
                    headers: {
                        ...GITHUB_HEADERS,
                        Accept: "application/vnd.github.mercy-preview+json",
                    },
                }),
            ]);

            // Process commit messages
            const commits = await commitsRes.json();
            commitMessages = commits?.map((c: any) => c.commit.message);

            // Process README content
            if (readmeRes.ok) {
                const readme = await readmeRes.json();
                readmePreview = Buffer.from(readme.content, "base64").toString("utf-8").slice(0, 300);
            }

            // Process repo topics
            if (topicsRes.ok) {
                const topicData = await topicsRes.json();
                topics = topicData.names;
            }
        }

        let highestStarCount = 0;
        try {
            const allReposRes = await fetch(`https://api.github.com/users/${githubId}/repos?per_page=100`, { headers: GITHUB_HEADERS });
            const allRepos = await allReposRes.json();

            if (Array.isArray(allRepos) && allRepos.length) {
                highestStarCount = Math.max(...allRepos.map((repo: any) => repo.stargazers_count || 0));
            }
        } catch { }

        // Get recent push event and calculate commit energy
        const events = await eventsRes.json();
        const pushEvent = events.find((e: any) => e.type === "PushEvent");
        const lastPushDate = pushEvent ? new Date(pushEvent.created_at) : null;

        const now = new Date();
        let commitEnergy = 0;
        if (lastPushDate) {
            const daysAgo = Math.floor((now.getTime() - new Date(lastPushDate).getTime()) / (1000 * 60 * 60 * 24));
            if (daysAgo < 7) commitEnergy = 90;
            else if (daysAgo < 30) commitEnergy = 60;
            else if (daysAgo < 90) commitEnergy = 30;
            else commitEnergy = 5;
        }

        // Calculate star power
        let starPower = 0;
        if (highestStarCount >= 100) starPower = 90;
        else if (highestStarCount >= 50) starPower = 70;
        else if (highestStarCount >= 10) starPower = 40;
        else if (highestStarCount >= 1) starPower = 20;
        else starPower = 5;

        const data = {
            user: {
                login: user.login,
                name: user.name,
                bio: user.bio,
                avatar_url: user.avatar_url,
                public_repos: user.public_repos,
                followers: user.followers,
                following: user.following,
                stars: highestStarCount,
                location: user?.location,
            },
            recentRepo: repo ? {
                name: repo.name,
                html_url: repo.html_url,
                description: repo.description,
                language: repo.language,
                topics,
                commitMessages,
                readmePreview,
            } : null,
            lastPushDate,
            devTraits: {
                commitEnergy, // out of 100
                starPower,    // out of 100
            }
        }

        const roast = await geminiRoastUser(data);

        if (!roast?.success) {
            return {
                success: false,
                status: 500,
                message: roast.message || "something went wrong while roasting the user",
                data: null,
            };
        }

        // Try to insert a roast card (without storing GitHub ID)
        let cardIdFormatted = '00000'; // Default fallback
        try {
            const roastCard = await prisma.roastCard.create({
                data: {}, // Prisma will handle createdAt and updatedAt automatically
            });

            cardIdFormatted = String(roastCard.id).padStart(5, '0');
        } catch (error) {
            console.error("Error tracking roast card generation:", error);
        }

        return {
            success: true,
            status: 200,
            message: "GitHub data fetched",
            data: {
                cardId: cardIdFormatted,
                user: {
                    login: user.login,
                    name: user.name,
                    bio: user.bio,
                    avatar_url: user.avatar_url,
                    public_repos: user.public_repos,
                    followers: user.followers,
                    following: user.following,
                    stars: highestStarCount,
                    location: user?.location,
                },
                roast: roast.data?.roastMessage,
                devTraits: {
                    commitEnergy, // out of 100
                    starPower,    // out of 100
                }
            }
        };

    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                success: false,
                status: 500,
                message: error?.message || "Something went wrong",
                data: null,
            };
        } else {
            return {
                success: false,
                status: 500,
                message: "Something went wrong",
                data: null,
            };
        }
    }
};


