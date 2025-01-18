const express = require('express')
const fs = require('fs');
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const secretKey = "mySecretKey";

// CARDS variable and Data try-catch
let cards;
try {
    const data = fs.readFileSync(__dirname + "/cards.json", "utf-8");
    cards = JSON.parse(data);
    console.log('Cards loaded successfully');
    console.log("Cards type:", Array.isArray(cards));
} catch (err) {
    console.error("There was an error");
}


let users;
try {
    const userData = fs.readFileSync(__dirname + '/users.json', "utf-8");
    users = JSON.parse(userData);
    console.log("Users Loaded Correctly");
} catch (error) {
    console.error("Error loading users");
    users = [];
}

app.post("/getToken", (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ errorMessage: "Username and password are required" })
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ errorMessage: "Invalid username or password" });
    }

    // Generate JWT
    const token = jwt.sign({ username: user.username }, secretKey, {
        expiresIn: "1m", // Token valid for 1 minute
    })

    res.status(200).json({ message: "Authentication successful", token });
})


// Filter through cards data to find requested info
function filterData(param, value) {

    if (param === 'id') {
        value = Number(value);
    }

    return cards.filter(card => card[param] === value);
}

// Display requested card data
app.get("/cards", (req, res) => {

    console.log("Cards Page");

    let filteredCards = cards;

    if (req.query.id) {
        filteredCards = filterData('id', req.query.id);
    }

    // Filter by set
    if (req.query.set) {
        filteredCards = filterData('set', req.query.set);
    }

    // Filter by type
    if (req.query.type) {
        filteredCards = filterData('type', req.query.type);
    }

    if (req.query.rarity) {
        filteredCards = filterData('rarity', req.query.rarity);
    }

    if (filteredCards.length === 0) {
        // res.status(404).json({ message: "No cards found matching the filters."});
        return res.send(`
            <h1>Can't Find Cardsv bm,.,
              </h1>
            <h3>Try Again!</h3>
        `)
    }

    let cardHTML = "<ul>";
    filteredCards.forEach(card => {
        if (!card.power || !card.toughness) {
            card.power = "N/A";
            card.toughness = "N/A"
        }

        cardHTML += `
            <li"><h2 style="font-weight: bold; margin: 0;">${card.id} - ${card.name}</h2> 
                <ul style="list-style: none; font-style: italic;">
                    <li><span style="font-weight: bold">Set:</span> ${card.set}</li>
                    <li><span style="font-weight: bold">Card Number:</span> ${card.cardNumber}</li>
                    <li><span style="font-weight: bold">Type:</span> ${card.type}</li>
                    <li><span style="font-weight: bold">Power:</span> ${card.power}</li>
                    <li><span style="font-weight: bold">Toughness:</span> ${card.toughness}</li>
                    <li><span style="font-weight: bold">Rarity:</span> ${card.rarity}</li>
                    <li><span style="font-weight: bold">Cost:</span> ${card.cost}</li>
                </ul>
            </li>
            <br>
        `;
    });
    cardHTML += "</ul>"

    res.send(`
        <h1>Cards List:</h1>
        ${cardHTML}
    `);

    // res.json(filteredCards);
})


app.listen(3000, () => {
    console.log("Practice live on Port: 3000");
})
