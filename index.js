const express = require('express');

const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
require('dotenv').config()
const port=process.env.PORT || 5000;
// toy-Shop
// 9NxeNgaflrOUGirZ

app.use(cors())


app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ovmtlgi.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    const ToyCollection=client.db('Toy-Shop').collection('shop');
//   server data pass db 
    app.post('/toy',async(req,res)=>{
        try {
          const addToy=req.body;
        console.log(addToy);
        const result=await ToyCollection.insertOne(addToy)
        res.send(result)
        } catch (error) {
          res.send(error)
        }
    })


// server data get 
  app.get('/toy',async(req,res)=>{
    try {
      let query={};
      const sort=req.query.sort;
      console.log(sort);
      if(req.query?.email){
         query={email:req.query.email}
      }
      if(sort){
       const result=await ToyCollection.find(query).sort({price:sort}).toArray()
      res.send(result)
      }else{
       const result=await ToyCollection.find(query).limit(20).toArray()
       res.send(result)
      }
    } catch (error) {
      res.send(error)
    }
     
  })

  app.get('/toy/:id',async(req,res)=>{
    try {
      const id=req.params.id;
    const query={_id:new ObjectId(id)}
    const result=await ToyCollection.findOne(query)
    res.send(result)
    } catch (error) {
      res.send(error)
    }

  })
  app.get("/searchToy/:text", async (req, res) => {
   try {
    const text = req.params.text;
    const result = await ToyCollection
      .find({
        $or: [
          { name: { $regex: text, $options: "i" } },
          
        ],
      })
      .toArray();
    res.send(result);
   } catch (error) {
    res.send(error)
   }
  });
  app.put('/Toy/:id',async(req,res)=>{
     try {
      const id=req.params.id;
     const filter={_id:new ObjectId(id)}
     const options={upsert:true};
     const updateToy=req.body;
     const addToy={
          $set:{
            price:updateToy.Price,
            quantity:updateToy.Quantity,
            description:updateToy.Description
            
          }
     }
     const result=await ToyCollection.updateOne(filter,addToy,options);
     res.send(result)
     } catch (error) {
      res.send(error)
     }
  })


  app.delete('/toy/:id',async(req,res)=>{
            try {
              const id=req.params.id;
              const query={_id: new  ObjectId(id)}
              const result=await ToyCollection.deleteOne(query)
              res.send(result)
            } catch (error) {
              res.send(error)
            }
  })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/',(req,res)=>{
   res.send('server is running');
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})