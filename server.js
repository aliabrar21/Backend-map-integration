import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser'

import authenticateToken from "./middleware/authenticationMiddleware.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(
    cors({
        origin: ["http://localhost:3002", "http://localhost:5000"], // ✅ Allow frontend and backend
        methods: ["GET", "POST", "PUT", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, // ✅ Allow cookies & auth headers
    })
);


app.options("*", cors());

const users = [
    { id: 1, username: "Adnan Ali", password: "adnan@123" },
    { id: 2, username: "Asif Ali", password: "asif@123" },
    { id: 3, username: "Aquib", password: "aquib@123" }
];

const sampleData =
    {
    "cards": [
        {
            "id": 1,
            "popupText": "Delhi",
            "imageUrl": "https://tse2.mm.bing.net/th?id=OIP.e1cY5kZkgEkPrZxP4CQQfAHaE7&pid=Api&P=0&h=180"
        },
        {
            "id": 2,
            "popupText": "Mumbai",
            "imageUrl": "https://tse3.mm.bing.net/th?id=OIP.UVasaYs2knTBo_bd1-pfpwHaFg&pid=Api&P=0&h=180"
        },
        {
            "id": 3,
            "popupText": "Bangalore",
            "imageUrl": "https://tse3.mm.bing.net/th?id=OIP.IYutKgeTsRQREp8v5kzd6gHaE8&pid=Api&P=0&h=180"
        },
        {
            "id": 4,
            "popupText": "Kolkata",
            "imageUrl": "https://tse1.mm.bing.net/th?id=OIP.cFA_teFDqXF7YFdxh5B7aAHaE7&pid=Api&P=0&h=180"
        },
        {
            "id": 5,
            "popupText": "Hyderabad",
            "imageUrl": "https://tse2.mm.bing.net/th?id=OIP.1g_PjPkuToYML-RxxLgcWgHaHa&pid=Api&P=0&h=180"
        }
    ]
}
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
        { expiresIn: "12h" }
    );

    res.json({ message: "Login successful", token });
});

// ✅ Dashboard API
app.get("/api/dashboard", authenticateToken, (req, res) => {
    res.json({ cards: sampleData });
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
