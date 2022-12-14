const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json())

// 
// 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qk4n58g.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // todo get the services
        const serviceCollection = client.db('doctorServerCollection').collection('services');
        const orderCollection = client.db('doctorServerCollection').collection('orders');

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        //todo get specific service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // todo orders api "post"

        app.get('/orders', async (req, res) =>{
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        app.post('/orders', async (req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        // todo patch
        app.patch('/orders/:id', async (req, res) =>{
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id)};
            const updateData = {
                $set:{
                    status: status
                }
            }
            const result = await orderCollection.updateOne(query, updateData);
            res.send(result);
        })


        // todo delete
        app.delete('/orders/:id', async (req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(error => console.error(error));





app.get('/', (req, res) => {
    res.send("This is a test!");
});

// todo port running on,,,
app.listen(port, () => {
    console.log('server is running on port: ', port);
})