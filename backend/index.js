require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
    const { codeSnippet } = req.body;

    const prompt = `
Jesteś ekspertem od testowania oprogramowania. Dokładnie analizujesz dostarczony fragment kodu. 
Wykrywasz typowe błędy, naruszenia zasad SOLID, prawa Demeter oraz sugerujesz poprawki lub ulepszenia.
Odpowiadasz zwięźle, profesjonalnie, jasno wskazując problemy oraz ich rozwiązania.

Fragment kodu:
${codeSnippet}
`;

    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            { params: { key: process.env.GEMINI_API_KEY } }
        );



        res.json({ analysis: response.data.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Błąd komunikacji z API Gemini.' });
    }
});

app.listen(4000, () => {
    console.log('✅  Backend działa na http://localhost:4000');
});
