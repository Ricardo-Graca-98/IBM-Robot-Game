![Image](https://upload.wikimedia.org/wikipedia/en/thumb/0/00/IBM_Watson_Logo_2017.png/220px-IBM_Watson_Logo_2017.png)

# **NiceBots! - IBM**
Created by Ricardo Graça, Rosa Baker, Aaron Desoiza, Adam Hartnell

---
## **Description**
NiceBots! is an android mobile robot fighting game that allows users to build their fighers depending on their personality scores.

The game uses **IBM's Watson Personality Insights AI** to build a profile from people's **Twitter** account. This is then compared to their ideal personality (which they choose at the start of the game). This then unlocks various weapons, shields and other powerups to build a tiny space fighter. User's play against each other in realtime to level up and improve their little bot, all with a focus on what makes a good person.

This game is **still in development** and it's made by a team of 4 people for an university assignment.

The concept of the game was brought to us by **IBM**

---
## **Installation**
To install the server just make a **copy** of the repository within your computer and be sure to have [NodeJS installed](https://nodejs.org/en/download/) too!

After that **be sure** to install all these **npm modules**:
```
npm install twitter
npm install rimraf
npm install twit
npm install socket.io
npm install http
```

Now to run it, head into your repository copy folder using the NodeJS terminal and run the command `node app.js`

---
## **Development Map**
This is what steps we followed to reach where we are now:
1. Using Node Red to work with Watson AI and Twitter.
2. Using Github within our project.
3. Moving from Node Red to NodeJS.
4. Concept designs of the game.
5. Unity prototypes.
6. Get tweets from user's accounts and process them in the Watson AI.
7. Create a server using NodeJS where Unity can access the information stored.
8. Communication between server and Unity game.
9. Created a leaderboard of the users.
10. Created fighting script.
11. Unity game interfaces.
12. Created a script to update the users personality scores weekly.
13. Created an authentication method using direct messages on Twitter
14. **IN PROGRESS**
