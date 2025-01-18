# Card-Shop

## About Project
### Built by: Kagesite 
This project demonstrates the use of different HTTP requests in a Node.js application. In this project, I learned how to implement the following Express.js methods:
- `app.get()`
- `app.post()`
- `app.put()`
- `app.delete()`

## How to use
### Step 1:
1. Start project using node app.js in the command line.
2. Connect to the server in the brower at http://localhost:3000/cards.
    ### Once connected: ###
    - You can start to search up, ?id="...", ?set="...", ?type="...", after the /cards path.
    - If there is a problem, check spelling or capitalize first letters.

### Step 2: Get Token - /getToken ###
1. Go to **token.http** file and click on the 'Send Request' for the first http request. This will give you a authorizatoin token that will have to be copied and pasted for the next requests

### Step 3: Create Request - /cards/create ###
1. Inside of the **token.http** file, copy your token into the < TOKEN HERE > on line 12, 28, and 43.
    - This will allow you to run all the requests with the proper authorization.
2. You can input new info in the given object below.
3. Once you have input your new card info, click on the 'Send Reqest' and it will create a new card.
    - You can find this card by making a new request in the browser. I prefer to search by ?id="..."

### Step 4: Update Request - /cards/:id ###
1. Step 4 can be used to Update info on any card you want.
2. Select a card by id
3. Updated and change the card info in the below object.
4. Make your request and search for that card in the browser to see the update.

### Step 5: Delete Request - /cards/:id ###
1. Adjust the request link to the id that you would like to delete.
2. Once done with the previous step, click on the 'Send Request'.
3. Go to the browser and search up that deleted card id and you should be given a message saying card isn't found.
