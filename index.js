const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.port || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors())
app.use(express.json())

// /car-doctor
// ffeY7M6RTZhaSMNC


// const uri = "mongodb://127.0.0.1/:27017";

const uri = `mongodb+srv://${process.env.USER_SEREET}:${process.env.USER_PASSWORD}@cluster0.n6wfj5p.mongodb.net/?retryWrites=true&w=majority`;


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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    // connect with my database colleection
    const serviceCollection = client.db('car-doctor').collection("services")   

    const bookingCollection = client.db("car-doctor").collection('Bookings')


// to get all services
   app.get('/services', async (req, res) => {
    const data = await serviceCollection.find().toArray()
     res.send(data)
   })
    
  //  get specific data by id
   app.get('/services/:id', async(req, res) => {
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const options = {
      projection: {title: 1, service_id: 1,
        price: 1, img: 1}
    }
    const result = await serviceCollection.findOne(query, options)
    res.send(result)
   })


  //  delete data
  app.delete('/bookings/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const result = await bookingCollection.deleteOne(filter)
    res.send(result)
  })


  // update data
  app.patch('/bookings/:id',async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const updateBooking = req.body
    const updateData = {
      $set: {
        status: updateBooking.status
      },
    }
    console.log(updateData);
    const result = await bookingCollection.updateOne(query, updateData)
    res.send(result)
  })

       // inser data into databse
    app.post('/bookings', async(req, res) => {
      const books = req.body
      const result = await bookingCollection.insertOne(books)
      res.send(result)
    })


    // get Booking data
    app.get('/bookings', async (req, res) =>  {
      let query = {}
      if(req.query?.email){
          query = {email: req.query.email};
      }
      const result = await bookingCollection.find(query).toArray()
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  const data = 'this is car doctor'
  res.send(data)
})

app.listen(port, () => {
    console.log('Server runnig');
})