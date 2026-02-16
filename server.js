const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// CORS Setting - အခြား Link (raptors.onrender.com) ကနေ ခေါ်တာကို ခွင့်ပြုဖို့
app.use(cors());
app.use(express.json());

// လက်ရှိ Folder ထဲက HTML ဖိုင်တွေကို ပွင့်အောင်လုပ်တာ
app.use(express.static(path.join(__dirname, '.')));

// ကိုကို့ရဲ့ Gemini API Key
const GEMINI_API_KEY = "AIzaSyB63jrk5SPwZyULGyi6lJIp2q0oIDFT9lQ"; 

// Backend အလုပ်လုပ်လား စစ်ဖို့ Link (https://raptorss.onrender.com/test)
app.get('/test', (req, res) => {
    res.send("Backend is running smoothly, Ko Ko!");
});

// AI ကို မေးတဲ့အပိုင်း
app.post('/ask', async (req, res) => {
    const userMsg = req.body.message;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // AI ကို ရက္ခိုင်လိုပဲ ဖြေခိုင်းဖို့ Instruction
    const promptInstructions = "You are a helpful assistant for ARAKHA_FORUM. Always reply in Rakhine language (Rakhine dialect) using Myanmar Unicode script. User: ";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptInstructions + userMsg }] }]
            })
        });

        const data = await response.json();

        // Google က Error တစ်ခုခု ပြန်လာရင်
        if (data.error) {
            console.error("Google API Error:", data.error.message);
            return res.status(400).json({ error: data.error.message });
        }

        // AI ဆီက စာသား အောင်မြင်စွာ ရလာရင်
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiText = data.candidates[0].content.parts[0].text;
            // Frontend ဆီကို reply ဆိုတဲ့ key နဲ့ ပို့မယ်
            res.json({ reply: aiText });
        } else {
            res.status(500).json({ error: "No text generated from AI." });
        }

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error: " + error.message });
    }
});

// Render ရဲ့ Port သို့မဟုတ် Port 3000 မှာ Run မယ်
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
