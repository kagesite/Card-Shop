const express = require('express')
const fs = require('fs');
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const secretKey = "mySecretKey";

// TOKEN AUTHENTICATION 
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ errorMessage: "Unauthorized access" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ errorMessage: "Forbidden Access" });
        }
        req.user = user
        next();
    })
}


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

// POST REQUEST FOR GETTING TOKEN (that matches user info)
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


// FUNCTION TO FILTER CARD DATA
function filterData(param, value) {

    if (param === 'id') {
        value = Number(value);
    }

    return cards.filter(card => card[param] === value);
}

// DISPLAY REQUESTED CARD DATA
app.get("/cards", (req, res) => {
    const { id, set, type, rarity } = req.query;

    let filteredCards = cards

    // Filtering using the query parameters if they exist
    if (id) {
        filteredCards = filteredCards.filter(card => card.id === parseInt(id));
    }

    if (set) {
        filteredCards = filteredCards.filter(card => card.set === set);
    }

    if (type) {
        filteredCards = filteredCards.filter(card => card.type === type);
    }

    if (rarity) {
        filteredCards = filteredCards.filter(card => card.rarity === rarity);
    }

    if (filteredCards.length === 0) {
        // res.status(404).json({ message: "No cards found matching the filters."});
        return res.send(`
            <h1>Can't Find Cards</h1>
              </h1>
            <a href="/cards"><h3>Try Again!</h3></a>
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

// CREATE A NEW CARD 
app.post("/cards/create", authenticateToken, (req, res) => {
    const { id, name, set, type, power, toughness, rarity, cost } = req.body;

    if (!id || !name || !set || !rarity) {
        return res.status(400).json({ errorMessage: "Missing required info" });
    }

    if (cards.some(card => card.id === id)) {
        return res.status(400).json({ errorMessage: "Card ID must be unique" });
    }

    // Create a new card
    const newCard = { id, name, set, type, power, toughness, rarity, cost };
    cards.push(newCard);

    // Save to file
    fs.writeFileSync(__dirname + "/cards.json", JSON.stringify(cards, null, 2));

    res.status(201).json({ successMessage: "Card created successfully" })

});


// UPDATE A CARD
app.put("/cards/:id", (req, res) => {
    const { id } = req.params;
    const { name, set, type, power, toughness, rarity, cost } = req.body;

    const cardIndex = cards.findIndex(card => card.id === Number(id));

    if (cardIndex === -1) {
        return res.status(404).json({ errorMessage: "Card not found"});
    }

    // Update card properties
    const updatedCard = {...cards[cardIndex], name, set, type, power, toughness, rarity, cost };
    cards[cardIndex] = updatedCard;
    
    fs.writeFileSync(__dirname + "/cards.json", JSON.stringify(cards, null, 2));

    res.json({ successMessage: "Card updated successfully", card: updatedCard });
})


// DELETE A CARD
app.delete("/cards/:id", (req, res) => {
    const { id } = req.params;

    const cardIndex = cards.findIndex(card => card.id === Number(id));
    if (cardIndex === -1) {
        return res.status(404).json({ errorMessage: "Card not found" });
    }

    const deletedCard = cards.splice(cardIndex, 1)[0];

    // save updated cards to file
    fs.writeFileSync(__dirname + "/cards.json", JSON.stringify(cards, null, 2));

    res.json({ successMessage: "Card deleted succesfully", card: deletedCard });
})



app.listen(3000, () => {
    console.log("Practice live on Port: 3000");
})
