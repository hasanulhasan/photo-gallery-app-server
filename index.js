const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zjh2ngr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const animalCollections = client.db('photo-gallery').collection('animals');
    const commentCollections = client.db('photo-gallery').collection('comments');
    app.get('/animals', async (req, res) => {
      const query = {};
      const cursor = animalCollections.find(query);
      const result = await cursor.toArray()
      res.send(result);
    })
    app.get('/animals/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await animalCollections.findOne(filter);
      res.send(result);
    })

    app.post('/comments', async (req, res) => {
      const comments = req.body;
      const result = await commentCollections.insertOne(comments);
      res.send(result);
    })
    app.get('/comments/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { commentIdOn: id };
      const result = await commentCollections.find(filter).toArray();
      res.send(result);
    })


  }
  finally {

  }
}
run().catch(e => console.error(e))

app.get('/', (req, res) => {
  res.send('Project server is running');
})

app.listen(port, () => {
  console.log(`Project server on ${port}`)
})