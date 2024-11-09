const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 8080;

// CORS setup
app.use(cors());
app.use(express.json());

const AIRTABLE_URL = 'https://api.airtable.com/v0/appUycLZwpqXOVZsQ/Youtube/';
const AIRTABLE_API_KEY = 'Bearer patX200VGkvIdjhvl.85e8e525a33b49ef814bfbfc0c0af14631faf88b39fd566a99a5c3de203a181a';

// Example route to fetch data from Airtable
app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get(AIRTABLE_URL, {
      headers: {
        Authorization: AIRTABLE_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Airtable' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
