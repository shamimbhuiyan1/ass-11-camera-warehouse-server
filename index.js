const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
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

client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
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
