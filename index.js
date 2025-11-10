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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB! Ye");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// api calls

app.get('/', (req, res) => {
    res.send('Hello Worlvafdd!')
})

const bills = [
    {
        "_id": "b1",
        "title": "Electricity Bill for October",
        "category": "Electricity",
        "email": "admin@example.com",
        "location": "Mirpur-10, Dhaka",
        "description": "Monthly electricity consumption for October.",
        "image": "https://example.com/electricity.jpg",
        "date": "2025-10-05",
        "amount": 320
    },
    {
        "_id": "b2",
        "title": "Gas Bill for October",
        "category": "Gas",
        "email": "admin@example.com",
        "location": "Dhanmondi, Dhaka",
        "description": "Monthly gas consumption for cooking and heating.",
        "image": "https://example.com/gas.jpg",
        "date": "2025-10-07",
        "amount": 450
    },
    {
        "_id": "b3",
        "title": "Water Bill for October",
        "category": "Water",
        "email": "admin@example.com",
        "location": "Banani, Dhaka",
        "description": "Monthly water usage for October.",
        "image": "https://example.com/water.jpg",
        "date": "2025-10-09",
        "amount": 150
    },
    {
        "_id": "b4",
        "title": "Internet Bill for October",
        "category": "Internet",
        "email": "admin@example.com",
        "location": "Gulshan, Dhaka",
        "description": "Monthly internet subscription bill.",
        "image": "https://example.com/internet.jpg",
        "date": "2025-10-12",
        "amount": 800
    },
    {
        "_id": "b5",
        "title": "Electricity Bill for November",
        "category": "Electricity",
        "email": "admin@example.com",
        "location": "Mirpur-10, Dhaka",
        "description": "Monthly electricity consumption for November.",
        "image": "https://example.com/electricity.jpg",
        "date": "2025-11-05",
        "amount": 340
    },
    {
        "_id": "b6",
        "title": "Gas Bill for November",
        "category": "Gas",
        "email": "admin@example.com",
        "location": "Dhanmondi, Dhaka",
        "description": "Monthly gas consumption for November.",
        "image": "https://example.com/gas.jpg",
        "date": "2025-11-07",
        "amount": 470
    },
    {
        "_id": "b7",
        "title": "Water Bill for November",
        "category": "Water",
        "email": "admin@example.com",
        "location": "Banani, Dhaka",
        "description": "Monthly water usage for November.",
        "image": "https://example.com/water.jpg",
        "date": "2025-11-09",
        "amount": 160
    },
    {
        "_id": "b8",
        "title": "Internet Bill for November",
        "category": "Internet",
        "email": "admin@example.com",
        "location": "Gulshan, Dhaka",
        "description": "Monthly internet subscription bill.",
        "image": "https://example.com/internet.jpg",
        "date": "2025-11-12",
        "amount": 820
    }
]

app.get('/bills', (req, res) => {
    res.send(bills)
})

app.post('/bills', (req, res) => {
    console.log("post method called", req.body);
    const newPayment = req.body;
    const inc = bills.length + 1;
    newPayment._id = `b${bills.length + 1}`;
    res.send(newPayment);
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
