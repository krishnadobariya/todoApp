const express = require("express");
const app = express();
const path = require('path')

//envirnoment veriable for port number
require('dotenv').config()

const port = process.env.PORT;
require('./db/conn');
const task = require('./model/schema')


app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const static_path = path.join(__dirname,  './public'); 
app.use(express.static(static_path));

app.listen(port, () => {
    console.log(`server running port number: ${port}`);
})



app.post('/', async(req,res) => {
    const Task = new task({
        content: req.body.content
    });
    try{
        await Task.save();
        res.redirect('/');
    }catch(e){
        res.redirect('/');
    }
})



app.get('/', (req,res) => {
    task.find({}, (err, tasks) => {
        res.render('todo', {Task : tasks})
    })
})
app.route('/edit/:id')

.get((req,res) => {
    const id = req.params.id;
    task.find({},(err, tasks) => {
        res.render('todoedit', {Task : tasks , idTask: id })
    })
})

.post((req,res) => {
    const id = req.params.id;
    task.findByIdAndUpdate(id, {content:req.body.content},err => {
        if(err) return res.send(500, err);
        res.redirect('/');
    })
})


app.route("/remove/:id")
.get((req, res) => {
    const id = req.params.id;
    task.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });