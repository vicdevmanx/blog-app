import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

//middle wares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");

app.get("/", (req, res) => { 
    res.render("index.ejs")
});

app.listen(PORT, () => { 
    console.log(`Server is running 127.0.0.1:${PORT}`)
})