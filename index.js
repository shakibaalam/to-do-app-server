const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v3m3f.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const tasksCollection = client.db("to-do-app").collection("tasks");

        app.get('/tasks/:email', async (req, res) => {
            const email = req.params.email;
            const cursor = tasksCollection.find({ email: email });
            const allTasks = await cursor.toArray();
            res.send(allTasks);
        });

        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            console.log(result);
            return res.send(result);
        });

        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        });

        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: task

            }
            const result = await tasksCollection.updateOne(filter, updateDoc);
            console.log(updateDoc);
            res.send(result);
        });
    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello everyone!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})