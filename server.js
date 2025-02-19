import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import session from "express-session"




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;
let posts = [{id:1, title: 'The book', content: 'ths is the thing about the book', date: 'no date', user: 'mary', gender: 'female', userid: 9000, time: 'notime'}, {id:2,title: 'The book', content: 'ths is the thing about the book', date: 'no date', user: 'adam', gender: 'male', userid: 9001, time: 'notime'}]; 


const users = [];


let month;
function getPostMonth(currrentDate) {
switch(currrentDate.getMonth()){
    case 0:
        month = "Jan"
        break;
    case 1:
        month = "Feb"
        break;
    case 2:
        month = "Mar"
        break;
    case 3: 
        month = "Apr"
        break;
    case 4:
        month = "May"
        break;
    case 5:
        month = "June"
        break;
    case 6:
        month = "July"
        break;
    case 7: 
        month = "Aug"
        break;
    case 8:
        month = "Sept"
        break;  
    case 9:
        month = "Oct"
        break;
    case 10:
        month = "Nov"
        break;
    case 11:
        month = "Dec"
        break;
    default:
        month = "No month"
}
}

//middle wares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret:'$%secretkey#!123£',
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    })
)
let data;

app.get("/", (req, res) => {
    res.render("index.ejs", {posts: posts, user: req.session.user})
});

app.get("/profile", (req, res) => { 
    if (!req.session.user) {
        return res.redirect("/login");
      }

      let userPosts = [];
        posts.forEach(post => {
            if(post.userid === req.session.user.id){
                userPosts.unshift(post);
            }
        });
        console.log(req.session.user.id)
        console.log(userPosts)
    res.render("profile.ejs", {posts: userPosts, user: req.session.user})
});


app.get("/createpost", (req, res) => {
    res.render("createpost.ejs")
});

app.get("/login", (req, res) => {
res.render('login.ejs')
})

app.get("/signup", (req, res) => {
    res.render('signup.ejs')
    })

app.post("/createpost", (req, res) => {
    const currrentDate = new Date();
    let description = '';
   for(let i = 0; i < req.body["content"].length; i++){
    if(i < 200){
        description += req.body["content"][i];
    }
    }
    description += '...'
    getPostMonth(currrentDate);
    data = {id: posts.length + 1,title: req.body["title"], description: description, content: req.body["content"], date: `${currrentDate.getDate()}th ${month} ${currrentDate.getFullYear()}`, time: `${currrentDate.getHours()% 12 || 12}:${currrentDate.getMinutes() < 10 ? '0' + currrentDate.getMinutes() : currrentDate.getMinutes() } ${currrentDate.getHours() < 12 ? 'AM' : 'PM'}`, user: `${req.session.user.name}`, gender: `${req.session.user.gender}`, userid: req.session.user.id}
    posts.unshift(data)
    res.redirect("/")
})


app.post("/login", (req, res) => {
const username = req.body["username"];
const password = req.body["password"];

for(let i = 0; i < users.length; i++){
    if(users[i].name === username && users[i].password === password){
        req.session.user = users[i];
        res.redirect("/profile")
    }
}
})

app.post("/signup", (req, res) => {
    const newUser = {id: users.length + 1, name: req.body["username"], email: req.body["email"], password: req.body["password"], gender: req.body.gender};
    users.push(newUser);
    console.log(newUser)
    res.redirect("/login")
})

app.get("/logout", (req, res) => {
        req.session.destroy(() => {
            res.redirect("/")
        })
})

app.get("/post/:id", (req, res) => {
    const id = req.params.id;
    let post = posts.find(post => post.id == id);
    res.render("posts.ejs", {post: post})
})


app.listen(PORT, () => { 
    console.log(`Server is running 127.0.0.1:${PORT}`)
})