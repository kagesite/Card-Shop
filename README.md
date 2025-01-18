# Card-Shop

### About Project ###
This project is about how to use different HTTP requests. In this project, I learned how to use ***app.get(), app.post(), app.put(), and app.delete().***

## How to use ##
### Step 1: ###
1. Start project using node app.js in the command line.
2. Connect to the server in the brower at http://localhost:3000/cards.
    ### Once connected: ###
    - You can start to search up, ?id="...", ?set="...", ?type="...", after the /cards path.
    - If there is a problem, check spelling or capitalize first letters.

### Step 2: /getToken ###
1. Go to **token.http** file and click on the 'Send Request' for the first http request. This will give you a authorizatoin token that will have to be copied and pasted for the next requests

### Step 3: /cards/create ###
1. Inside of the **token.http** file, copy your token into the < TOKEN HERE > on line 12, 28, and 43.
    - This will allow you to run all the requests with the proper authorization.
2. You can input new info in the given object below.
3. Once you have input your new card info, click on the 'Send Reqest' and it will create a new card.
    - You can find this card by making a new request in the browser. I prefer to search by ?id="..."

