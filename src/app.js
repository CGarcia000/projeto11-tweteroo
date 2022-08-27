import express from "express";
import cors from "cors";

const users = [];

const tweets = [];

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('deu certo o get');
})

app.post('/sign-up', (req, res) => {
    const { username, avatar } = req.body;
    if (!username || !avatar) {
        res.sendStatus(400);
        return;
    }

    users.push({username, avatar});
    res.send("OK");
});

app.post('/tweets', (req, res) => {
    const { username, tweet } = req.body;

    if (!username || !tweet) {
        res.sendStatus(400);
        return;
    }

    tweets.unshift({username, tweet});
    res.send("OK");
});

app.get('/tweets', (req, res) => {
    const tweetSend = tweets.slice(0, 10);
    tweetSend.forEach(tweet => {
        const user = users.filter(user => user.username === tweet.username);
        tweet.avatar = user[0].avatar;
    })
    
    res.send(tweetSend);
});


app.listen(5000);