// index.js
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;

let numberWindow = [];

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



  
  const URLS = {
    p: 'http://20.244.56.144/evaluation-service/primes',
    f: 'http://20.244.56.144/evaluation-service/fibo',
    e: 'http://20.244.56.144/evaluation-service/even',
    r: 'http://20.244.56.144/evaluation-service/rand'
  };
  
  const getAccessToken = async () => {
    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', {
      email: "2200030348cseh@gmail.com",
    name: "shaik nusratraheel",
    rollNo: "2200030348",
    accessCode: "beTJjJ",
    clientID: "831401b5-1d29-40ac-afba-11880eeb4703",
    clientSecret: "YBZABMryhdbpQcjC"
    });
    return response.data.access_token;
  };
  const fetchWithTimeout = async (url, token, timeout = 500) => {
    try {
      const response = await axios.get(url, {
        timeout,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.numbers;
    } catch (error) {
      console.error("Fetch error:", error.message);
      return [];
    }
  };
  
  app.get('/numbers/:numberid', async (req, res) => {
    const id = req.params.numberid.toLowerCase();
    const url = URLS[id];
    if (!url) return res.status(400).json({ error: "Invalid numberid" });
  
    const token = await getAccessToken(); 
    const newNumbers = await fetchWithTimeout(url, token);
  
    const prevState = [...numberWindow];
  
    
    for (let num of newNumbers) {
      if (!numberWindow.includes(num)) numberWindow.push(num);
    }
  
    if (numberWindow.length > WINDOW_SIZE) {
      numberWindow = numberWindow.slice(-WINDOW_SIZE);
    }
  
    const avg = numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length;
  
    res.json({
      windowPrevState: prevState,
      windowCurrState: numberWindow,
      numbers: newNumbers,
      avg: avg.toFixed(2)
    });
  });
  
  