const express=require('express')
const app=express();
const fs=require("fs/promises")

const port =3000;
app.use(express.json());





const Notesfs='Notes.json'


app.get('/notes', async(req,res) => {
   res.json( await fs.readFile(Notesfs, 'utf-8'));
});


app.get('/notes/:id', async(req, res) => {
 const Id=req.params.id;
  const Note = (JSON.parse(await fs.readFile(Notesfs, 'utf-8'))).find(n => n.id == Id); 
  if (Note) {
    res.json(Note);
  } else {
    res.json({ message: 'wrong id' });
  }
});





app.delete('/notes/:id', async(req, res) => {
  const Id = req.params.id;
  const Note = (JSON.parse(await fs.readFile(Notesfs, 'utf-8'))).filter(n => n.id != Id);
  await fs.writeFile(Notesfs, JSON.stringify(Note, null, 2));
  res.json({ message: 'Note deleted' });
});






app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



