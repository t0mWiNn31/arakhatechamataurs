const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// CORS ကို အကုန်ဖွင့်ထားမယ်
app.use(cors());
app.use(express.json());

// မူရင်း Forum ဖိုင်တွေ ရှိတဲ့နေရာကို ညွှန်းမယ်
app.use(express.static(path.join(__dirname, '.')));

const GEMINI_API_KEY = "AIzaSyB63jrk5SPwZyULGyi6lJIp2q0oIDFT9lQ";

// စမ်းသပ်ဖို့ Link (Browser ကနေ https://raptorss.onrender.com/test လို့ ရိုက်ကြည့်လို့ရတယ်)
app.get('/test', (req, res) => res.send("Backend is working!"));

app.post('/ask', async (req, res) => {
    try {
        const userMsg = req.body.message;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Always reply in Rakhine language: " + userMsg }] }]
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
