import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import session from "express-session";
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;
let posts = [{id:1, title: 'The book', description: 'my description',content: 'ths is the thing about the book', date: 'no date', user: 'mary', gender: 'female', userid: 9000, time: 'notime'}, {id:2,title: 'The book', description: 'my description', content: 'ths is the thing about the book', date: 'no date', user: 'adam', gender: 'male', userid: 9001, time: 'notime'}]; 
let users = [];
let month;


/////////////////////////////////////// JSON Storage
const filePath = './data.json';
////////////////////////////////////////////////////////////////////////////////////////////////////
// Load data from file on server start
function loadData() {
    if (fs.existsSync(filePath)) {
        if (!fs.existsSync(filePath)) {
            console.log('data.json not found, creating a new one...');
            fs.writeFileSync(filePath, JSON.stringify({ users: [], posts: [] }, null, 2));
        }
    
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8').trim();
            if (fileContent) {
                const parsedData = JSON.parse(fileContent);
                users = parsedData.users || [];
                posts = parsedData.posts || [];
            }
        } catch (err) {
            console.error('Error reading file:', err);
        }
    }
}

// Write global data to file
function writeData() {
    try {
        fs.writeFile(filePath, JSON.stringify({ users, posts }, null, 2));
    } catch (err) {
        console.error('Error writing file:', err);
    }
}

// Load data when the server starts
loadData();
////////////////////////////////////////////////////////////////////////////////////////////////////




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
//////////////////////////////////////////////////////////

// get

let data;
//routes get.'/'
app.get("/", (req, res) => {
    res.render("index.ejs", {posts: posts, user: req.session.user})
});



//routes get.'/profile'
app.get("/profile", (req, res) => { 
    if (!req.session.user) {
        return res.redirect("/login");
      }

      let userPosts = [];
        posts.forEach(post => {
            if(post.userid === req.session.user.id){
                userPosts.push(post);
            }
        });
        console.log(req.session.user.id)
        console.log(userPosts)
    res.render("profile.ejs", {posts: userPosts, user: req.session.user})
});



//routes get.'/createpost'
app.get("/createpost", (req, res) => {
    if(req.session.user) {
    res.render("createpost.ejs", {user: req.session.user})
    } else  {res.redirect('/login')}
});



//routes get.'/login'
app.get("/login", (req, res) => {
const errorMsg = req.query.error;

res.render('login.ejs', {  errorMsg })
})



//routes get.'/signup'
app.get("/signup", (req, res) => {
    res.render('signup.ejs')
    })


//routes get.'/logout'
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
})


//routes get./post/:id'
app.get("/post/:id", (req, res) => {
const id = req.params.id;
let post = posts.find(post => post.id == id);
res.render("posts.ejs", {post: post})
})


//routes get.'deletepost/:id'
app.post('/deletepost/:id',(req, res) => {
    let postId = req.params.id;
    posts = posts.filter((post) => String(post.id) !== String(postId))
    writeData();
    res.redirect("/");
})



//routes get.'editpost/:id'
// app.get('/editpost/:id',(req, res) => {
//     res.redirect("/profile");
// })


////////////////////////////////////////////////////////////////////////////

//post

//routes post.'/createpost'
app.post("/createpost", (req, res) => {
    const currrentDate = new Date();
    let description = '';
    for(let i = 0; i < req.body["content"].length; i++){
        if(i < 200){
            description += req.body["content"][i];
        }
    }
    description += '...';
    getPostMonth(currrentDate);
    data = {id: posts.length + 1,title: req.body["title"], description: description, content: req.body["content"], date: `${currrentDate.getDate()}th ${month} ${currrentDate.getFullYear()}`, time: `${currrentDate.getHours()% 12 || 12}:${currrentDate.getMinutes() < 10 ? '0' + currrentDate.getMinutes() : currrentDate.getMinutes() } ${currrentDate.getHours() < 12 ? 'AM' : 'PM'}`, user: `${req.session.user.name}`, gender: `${req.session.user.gender}`, userid: req.session.user.id}
    posts.unshift(data);
    res.redirect("/")
     writeData();
})



//routes post.'/Plogin'
app.post("/Plogin", (req, res) => {
const username = req.body["username"];
const password = req.body["password"];

const validUser = users.find( user => user.name === username && user.password === password );
console.log(validUser)
if(validUser) {
        req.session.user = validUser;
        res.redirect("/profile")
}else {
    res.redirect("/login?error=Invalid credentials, try again!")
}

})


//routes post.'/signup'
app.post("/signup", (req, res) => {
    const username = req.body["username"];
    const password = req.body["password"];
    const validUser = users.find( user => user.name === username && user.password === password );
    if(!validUser) {
    const newUser = {id: users.length + 1, name: username, email: req.body["email"], password: req.body["password"], gender: req.body.gender};
    users.push(newUser);
    console.log(newUser);
    writeData();
    res.redirect("/login")
    }else {
        res.redirect("/login")
    }
})


/////////////////////////////////////////////////////
app.listen(PORT, () => { 
    console.log(`Server is running 127.0.0.1:${PORT}`)
})