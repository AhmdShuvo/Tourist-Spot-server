const express = require("express");
const cors = require("cors")
const app = (express())
require("dotenv").config();
const Objectid=require('mongodb').ObjectId;
const { MongoClient} = require("mongodb");
const { query } = require("express");



// try port 9000//
const port = process.env.PORT || 9000;

    app.use(cors());

    app.use(express.json());



    app.get('/', async (req, res) => {

        res.send("server Running")
    })

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0qtlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    
    //  Connect to database //
    async function run() {
        try {
            await client.connect();
            console.log('connected to db');
            const database = client.db('TouristSpot');
            const placesCollection = database.collection('places');
            const ordersCollection = database.collection('orders');
    
                    //    get data from data base to url ///
            app.get('/places',async(req,res)=>{
    
                     const cursor=placesCollection.find({})
                     const places=await cursor.toArray()
    
    
                     res.json(places)
    
            });
    
          
            
    
            app.post('/orders',async(req,res)=>{
    
                   const userData=req.body;
                   
                   const result= await ordersCollection.insertOne(userData)
                     res.json(result)
    
            });
    
            app.post("/places",async(req,res)=>{
    
                const product=req.body;
    
                const result=await placesCollection.insertOne(product);
                
                res.send(result)
            })
    
            app.get('/orders',async(req,res)=>{
    
                const cursor=ordersCollection.find({})
                const users=await cursor.toArray()
            
                res.json(users)
            })
    
            app.put("/order/:id",async(req,res)=>{
                const id=req.params.id;
              
              
              const updateUser=req.body;
          
               const filter={_id: Objectid(id)}
               const options = { upsert: true };
               const updateDoc = {
                $set: {
                  status: `active`
                },
              };
    
              const result= await ordersCollection.updateMany(filter,updateDoc,options)
             
    
    
               res.json(result)
            })
                           
       
           
    
            app.get("/orders/:email",async (req,res)=>{
    
                const email=req.params;
             
              const query={Email:email.email}
    
               const result= await ordersCollection.find(query).toArray()
           
                res.send(result)
            });
            
  
        } finally {
            // Ensures that the client will close when you finish/error
            //   await client.close();
        }
    }
    
    run().catch(console.dir);
    
    //    Root path ///




    app.listen(port, () => {
        console.log("Running on port", port);
    
    })