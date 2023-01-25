const { MongoClient, Admin } = require("mongodb");
const Objectid = require('mongodb').ObjectId;
const express = require('express');
const cors = require('cors');
require("dotenv").config();

// USED FOR READING FILE IN EXPRESS//
const fileUpload = require('express-fileupload')

const app = (express())

const port = process.env.PORT || 9000;


app.use(express.json())
app.use(cors())
app.use(fileUpload())
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
            const BlogsCollection = database.collection('Blogs')
    
                    //    get data from data base to url ///
            app.get('/places',async(req,res)=>{
    
                     const cursor=placesCollection.find({})
                     const places=await cursor.toArray()
    
    
                     res.json(places)
    
            });
    
          
            
            //  POST orders ////
            app.post('/orders',async(req,res)=>{
    
                   const userData=req.body;
                   
                   const result= await ordersCollection.insertOne(userData)
                     res.json(result)
    
            }); 

            // POST NEW PLACES  //
    
            app.post("/places",async(req,res)=>{
    
                const product=req.body;
    
                const result=await placesCollection.insertOne(product);
                
                res.send(result)
            })
       
            // GET ALL ORDERS ///
            app.get('/orders',async(req,res)=>{
    
                const cursor=ordersCollection.find({})
                const users=await cursor.toArray()
            
                res.json(users)
            }) 

            // POST BLOGS //

            app.post("/blogs",async(req,res)=>{
                const data=req.body;
                const result=await BlogsCollection.insertOne(data);
                res.send(result)

            })
            app.get("/blog/:id", async (req, res) => {

                const id = req.params.id;
                const query = { _id: Objectid(id) }
              
                const result = await BlogsCollection.findOne(query);
                res.json(result)
              });
              
              app.delete('/blog/:id', async (req, res) => {
              
                const id = req.params.id;
                const query = { _id: Objectid(id) }
              
                const result = await BlogsCollection.deleteOne(query);
              
                res.send(result)
              });
              
              
                app.get("/blogs",async(req,res)=>{
                 const cursor= BlogsCollection.find({});
                 const result= await cursor.toArray();
                 res.json(result)
                
                });
            // CHANGE STATUS ///
    
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
                         
            
            // DELETE ANY ORDER ////
            app.delete("/order/:id",async(req,res)=>{
    
                const id=req.params.id;
    
                const query={_id: Objectid(id)}
                const result=await ordersCollection.deleteOne(query);
    
                res.send(result)
            })
            
            // GET SPECIFIC ORDER by user //
    
            app.get("/orders/:email",async (req,res)=>{
    
                const email=req.params;
             
              const query={Email:email.email}
    
               const result= await ordersCollection.find(query).toArray()
           
                res.send(result)
            });
              
            // GET SPECIFIC ORDER //

            app.get("/order/:id", async (req,res)=>{
    
                const id=req.params.id;
    
                const query={_id:Objectid(id)}
    
    
                const result= await ordersCollection.find(query).toArray();
                res.json(result)
    
     
            })
           
    
    
            
    
    
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