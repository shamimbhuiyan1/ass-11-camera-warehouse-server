const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
//using middleware
app.use(cors());
app.use(express.json());

//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oer4d.mongodb.net/?retryWrites=true&w=majority`;
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

      app.post("/product", async (req, res) => {
        const newProduct = req.body;
        console.log("Adding new user", newProduct);
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
      });

      // update product
      app.put("/product/:id", async (req, res) => {
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

      //delete a product from server side
      app.delete("/product/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await productCollection.deleteOne(query);
        res.send(result);
      });
    });

    //page count
    app.get("/product", async (req, res) => {
      console.log("query", req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = productCollection.find(query);
      let products;
      if (page || size) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.send(products);
    });

    app.get("/productCount", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });
  } finally {
  }
}

run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("This is Online Camera Warehouse.");
});

app.listen(port, () => {
  console.log("Running to the CRUD.");
});
