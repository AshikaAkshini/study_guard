const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and body parsing
app.use(cors());
app.use(express.json());

// Serve static frontend files from the same directory
app.use(express.static(path.join(__dirname)));

// Route to handle mock WhatsApp notifications
app.post('/send-whatsapp', (req, res) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n======================================================`);
    console.log(`[${timestamp}] 📱 WHATSAPP NOTIFICATION TRIGGERED!`);
    console.log(`[Status]: SLEEP/ABSENCE DETECTED`);
    console.log(`[Action]: Dispatching automated guard message to parent...`);
    console.log(`======================================================\n`);
    
    // To connect real WhatsApp messaging, developers can integrate Twilio SMS API
    // or whatsapp-web.js libraries here.
    
    res.json({ 
        success: true, 
        message: "WhatsApp mock alert processed successfully on server!" 
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Stainless Study Guard server running!`);
    console.log(`👉 Access the dashboard: http://localhost:${PORT}`);
    console.log(`👉 Mock notifications endpoint ready at: http://localhost:${PORT}/send-whatsapp\n`);
});
