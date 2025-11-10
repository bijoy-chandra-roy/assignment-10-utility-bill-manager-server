const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@assignment-10-utility-b.hziriy6.mongodb.net/?appName=assignment-10-utility-bill-manager-database`;

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

        const usersDB = client.db("usersDB");
        const usersColl = usersDB.collection("usersColl");

        // database related apis

        app.get('/bills', async(req,res)=>{
            const cursor = usersColl.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/bills', async (req, res) => {
            const newPayment = req.body;
            console.log("POST: ", newPayment);
            const result = await usersColl.insertOne(newPayment);
            console.log(result);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        
    }
}
run().catch(console.dir);

// api calls

app.get('/', (req, res) => {
    res.send('Get working')
})


// app.post('/bills', (req, res) => {
//     console.log("post method called", req.body);
//     const newPayment = req.body;
//     const inc = bills.length + 1;
//     newPayment._id = `b${bills.length + 1}`;
//     res.send(newPayment);
// })
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
