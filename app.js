require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Groq = require('groq-sdk');

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/ask', async (req, res) => {
  const userQuestion = req.body.question;

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You are a helpful nutrition advisor." },
        { role: "user", content: userQuestion }
      ]
    });

    const aiAnswer = response.choices[0].message.content;
    res.render('result', { question: userQuestion, answer: aiAnswer });
  } catch (error) {
    console.error(error);
    res.send("Error getting AI response. Please try again.");
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
