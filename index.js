const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

const app = express()
const corsOptions = {
  origin: ['http://localhost:5173','http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nhcslav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {

    const blogCollection = client.db('blog').collection('blogs')
    const wishCollection = client.db('blog').collection('wish')


     //   Get all blogs data from db
     app.get('/blogs', async(req, res)=>{
      const result = await blogCollection.find().toArray()
      res.send(result)
  })

    // save a blog data in db
    app.post('/blog', async (req, res) => {
      const BlogData = req.body
      const result = await blogCollection.insertOne(BlogData)
      res.send(result)
    })

    app.get('/blogs/:id', async (req, res) => {
      const blogId = req.params.id;
      try {
          const result = await blogCollection.findOne({ _id:new ObjectId(blogId)});
          res.send(result);
      } catch (error) {
          console.error('Error finding blog:', error);
          res.status(500).send({ error: 'Internal server error' });
      }
  });
   
    app.get("/wish/:id", async(req, res) =>{
      console.log(req.params._id);
      const result =await wishCollection.find({email:req.params._id}).toArray();
      res.send(result)
    })

app.get('/wish-find/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await wishCollection.find({ user_id: userId }).toArray();
    res.send(result);
  } catch (error) {
    console.error('Error finding wishes:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/wish-create', async (req, res) => {
  try {
    const wishData = req.body;
    const result = await wishCollection.insertOne(wishData);
    res.send(result);
  } catch (error) {
    console.error('Error creating wish:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.get("/view/:id", async (req, res) => {
  const result = await blogCollection.findOne({ _id: new ObjectId(req.params.id) });
  console.log(result)
  res.send(result)
})

   //   Get all blogs data from db
   app.get('/all-blogs', async(req, res)=>{
    const result = await blogCollection.find().toArray()
    res.send(result)
})

   //   Get all blogs data from db for pagination
   app.get('/blogs-count', async(req, res)=>{
    const count = await blogCollection.countDocuments()
    res.send({count})
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('ruuning BlogSphere')
})

app.listen(port, () => console.log(`Server running on port ${port}`))