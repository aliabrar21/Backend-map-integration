import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import authenticateToken from "./middleware/auths.js";
import SampleDashboardData from "./carddata.json" assert { type: "json" };

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for frontend requests
app.use(express.json());

const users = [
    { id: 1, username: "Adnan Ali", password: "adnan@123" },
    { id: 2, username: "Asif Ali", password: "asif@123" },
    { id: 3, username: "Aquib", password: "aquib@123" }
];

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// ✅ Login API
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());

    if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
});

// ✅ Dashboard API
app.get("/api/dashboard", authenticateToken, (req, res) => {
    res.json({ cards: SampleDashboardData });
});

// ✅ Map API (India default location)
app.get("/api/map", authenticateToken, (req, res) => {
    const defaultLocation = {
        name: "India",
        lat: 20.5937,
        lon: 78.9629,
        bounds: [
            [8.0, 68.0],
            [37.0, 97.0],
        ],
    };
    res.json(defaultLocation);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
