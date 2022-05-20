const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

//using middleware
app.use(cors());
app.use(express.json());

//mongodb
const uri = `mongodb+srv://product:NumxIVcbkwG9GD0z@cluster0.oer4d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("cameraStore").collection("product");
    console.log("db connected");

    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const product = await cursor.toArray();
      res.send(product);

      app.post("/inventory", async (req, res) => {
        const newProduct = req.body;
        console.log("Adding new user", newProduct);
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
      });

      // update user
      app.put("/inventory/:id", async (req, res) => {
        const id = req.params.id;
        const updatedProduct = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            name: updatedProduct.name,
            email: updatedProduct.email,
          },
        };
        const result = await productCollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        res.send(result);
      });

      //delete a user from server side
      app.delete("/inventory/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await productCollection.deleteOne(query);
        res.send(result);
      });
    });

    //page count
    app.get("/productCount", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });
  } finally {
  }
}
setTimeout(() => {
  client.close();
}, 1500);
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("This is Online Camera Warehouse.");
});

app.listen(port, () => {
  console.log("Running to the CRUD.");
});
