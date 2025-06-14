import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.get("/github/login", (req, res) => {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user+repo`;
    res.redirect(redirectUrl);
});

app.get("/github/callback", async (req, res) => {
    const code = req.query.code;

    try {
        // Exchange code for access token
        const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
            },
            {
                headers: { Accept: "application/json" },
            }
        );

        const accessToken = tokenRes.data.access_token;

        // Fetch user data
        const userRes = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
            },
        });

        // Redirect to frontend with token and user data
        const params = new URLSearchParams({
            token: accessToken,
            username: userRes.data.login,
            avatar: userRes.data.avatar_url,
        });

        res.redirect(`${FRONTEND_URL}/login-success?${params.toString()}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Authentication failed.");
    }
});

app.listen(3001, () => {
    console.log("🚀 Server running at http://localhost:3001");
});
