const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testAPI() {
  try {
    console.log('Testing OpenAI API key...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say 'API test successful'"
        }
      ],
      max_tokens: 10,
    });

    console.log('API test successful:', completion.choices[0].message.content);
  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testAPI();