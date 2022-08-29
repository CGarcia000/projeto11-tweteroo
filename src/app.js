import express from "express";
import cors from "cors";

const users = [];

const tweets = [];

function verifyAccountName(username) {
    const accountsNames = users.filter(user => user.username === username);
    return (accountsNames.length === 0);
}

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', (req, res) => {
    const { username, avatar } = req.body;
    if (!username || !avatar) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }
    const isNewUsername = verifyAccountName(username);

    if (!isNewUsername) return res.status(400).send("Nome de usuário já em uso");

    users.push({username, avatar});

    res.status(201).send("OK");
});

app.post('/tweets', (req, res) => {
    const username = req.header("user");
    const { tweet } = req.body;

    if (!username || !tweet) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    tweets.unshift({username, tweet});
    res.status(201).send("OK");
});

app.get('/tweets', (req, res) => {
    const page = parseInt(req.query.page);
    if (!page || isNaN(page) || page < 1) return res.status(400).send("Informe uma página válida");

    const pages = [(page - 1) * 10, page * 10];

    const tweetSend = tweets.slice(pages[0], pages[1]);
    tweetSend.forEach(tweet => {
        const user = users.filter(user => user.username === tweet.username);
        tweet.avatar = user[0].avatar;
    })
    
    res.send(tweetSend);
});

app.get('/tweets/:username', (req, res) => {
    const username = req.params.username;
    const user = users.filter(user => user.username === username)[0];
    
    if (!user) return res.status(404).send("Nenhum usuário encontrado");
    
    const userAvatar = user.avatar;
    const tweetSend = tweets.filter(tweet => tweet.username === username);
    tweetSend.forEach(tweet => {
        tweet.avatar = userAvatar;
    })
    
    res.send(tweetSend);
});


app.listen(5000);