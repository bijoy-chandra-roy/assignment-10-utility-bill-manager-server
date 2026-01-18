const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();

        const utilityDB = client.db("utilityBillManagement");
        const bills = utilityDB.collection("bills");
        const myBills = utilityDB.collection("myBills")
        const categoriesColl = utilityDB.collection("categories");

        // database related apis
        app.get("/categories", async (req, res) => {
            const categories = await categoriesColl.find({}).toArray();
            res.json(categories);
        });


        app.get('/bills', async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 9; 
            const skip = (page - 1) * limit;

            const { category, search, minPrice, maxPrice, sort } = req.query;

            let query = {};

            if (category && category !== 'All Categories') {
                query.category = category;
            }

            if (search) {
                query.title = { $regex: search, $options: 'i' };
            }

            if (minPrice || maxPrice) {
                query.amount = {};
                if (minPrice) query.amount.$gte = parseFloat(minPrice);
                if (maxPrice) query.amount.$lte = parseFloat(maxPrice);
            }

            let sortOptions = { date: -1 };
            if (sort === 'price_asc') sortOptions = { amount: 1 };
            else if (sort === 'price_desc') sortOptions = { amount: -1 };
            else if (sort === 'date_asc') sortOptions = { date: 1 };

            const total = await bills.countDocuments(query);
            
            const result = await bills.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .toArray();

            const finalResult = result.map(bill => ({
                ...bill,
                images: (!bill.images || !Array.isArray(bill.images)) 
                    ? (bill.image ? [bill.image, bill.image, bill.image] : []) 
                    : bill.images
            }));

            res.send({
                bills: finalResult,
                totalBills: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit)
            });
        });

        // find
        app.get('/bills/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bills.findOne(query);

            if (result) {
                if (!result.images || !Array.isArray(result.images)) {
                    result.images = result.image ? [result.image, result.image, result.image] : [];
                }
            }
            
            res.send(result);
        });

        app.post('/bills', async (req, res) => {
            const newPayment = { ...req.body, date: new Date() };
            const result = await bills.insertOne(newPayment);
            res.send(result);
        });

        app.post('/my-bills', async (req, res) => {
            const payment = req.body;
            const result = await myBills.insertOne(payment);
            res.send(result);
        });

        app.get('/my-bills/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await myBills.find(query).toArray();
            res.send(result);
        });

        app.patch('/my-bills/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: req.body
            };
            const result = await myBills.updateOne(filter, updatedDoc);
            res.send(result);
        });

        app.delete('/my-bills/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await myBills.deleteOne(query);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

// api calls

app.get('/', (req, res) => {
    res.send('Get working')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;