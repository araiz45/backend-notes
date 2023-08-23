const express = require('express')
const mongoose = require("mongoose")
var cors = require('cors')
const app = express()
const port = 5000

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended: false}))

mongoose.connect('mongodb://127.0.0.1:27017/Notes').then(()=>{
    console.log("connected db")
})

const notesModel = mongoose.model('notes', { 
    note: String,
    timming: {
        type: Date,
        default: Date.now()
    }
});



app.post('/add', async (req, res) => {
    console.log(req.body.note)
    const newNote = notesModel({note: req.body.note})
    await newNote.save().then(()=>{
        res.send({message: "note has been added sucessfully"})
    }).catch((err)=>{
        res.send({message: "note did not added because of this error " + err})
    })
})

app.get("/get", async(req, res)=>{
    const notes = await notesModel.find()
    .sort({"timming": "descending"});
    console.log(notes)
    res.send({notes})
})

app.put("/edit", async(req, res)=>{
    console.log(req.query.id, req.body)
    await notesModel.findByIdAndUpdate(req.query.id, req.body).then(()=>{
        res.send({message: "updated sucessfully"})
    }).catch((err)=>{
        res.send({message: "unable to update"})
    })
})

app.delete("/del", async(req, res)=>{
    console.log(req.query.id)
    await notesModel.findByIdAndDelete(req.query.id).then(()=>{
        res.send({message: "deleted successfully"})
    }).catch((err)=>{
        res.send({message: "unable to deleted"})
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})