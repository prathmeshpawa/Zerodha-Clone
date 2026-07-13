require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");

const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/addHoldings", async (req, res) => {
  const tempHoldings = [
    {
      name: "BHARTIARTL",
      qty: 2,
      avg: 538.05,
      price: 541.15,
      net: "+0.58%",
      day: "+2.99%",
    },
    {
      name: "HDFCBANK",
      qty: 2,
      avg: 1383.4,
      price: 1522.35,
      net: "+10.04%",
      day: "+0.11%",
    },
    {
      name: "HINDUNILVR",
      qty: 1,
      avg: 2335.85,
      price: 2417.4,
      net: "+3.49%",
      day: "+0.21%",
    },
    {
      name: "INFY",
      qty: 1,
      avg: 1350.5,
      price: 1555.45,
      net: "+15.18%",
      day: "-1.60%",
      isLoss: true,
    },
    {
      name: "ITC",
      qty: 5,
      avg: 202.0,
      price: 207.9,
      net: "+2.92%",
      day: "+0.80%",
    },
    {
      name: "KPITTECH",
      qty: 5,
      avg: 250.3,
      price: 266.45,
      net: "+6.45%",
      day: "+3.54%",
    },
    {
      name: "M&M",
      qty: 2,
      avg: 809.9,
      price: 779.8,
      net: "-3.72%",
      day: "-0.01%",
      isLoss: true,
    },
    {
      name: "RELIANCE",
      qty: 1,
      avg: 2193.7,
      price: 2112.4,
      net: "-3.71%",
      day: "+1.44%",
    },
    {
      name: "SBIN",
      qty: 4,
      avg: 324.35,
      price: 430.2,
      net: "+32.63%",
      day: "-0.34%",
      isLoss: true,
    },
    {
      name: "SGBMAY29",
      qty: 2,
      avg: 4727.0,
      price: 4719.0,
      net: "-0.17%",
      day: "+0.15%",
    },
    {
      name: "TATAPOWER",
      qty: 5,
      avg: 104.2,
      price: 124.15,
      net: "+19.15%",
      day: "-0.24%",
      isLoss: true,
    },
    {
      name: "TCS",
      qty: 1,
      avg: 3041.7,
      price: 3194.8,
      net: "+5.03%",
      day: "-0.25%",
      isLoss: true,
    },
    {
      name: "WIPRO",
      qty: 4,
      avg: 489.3,
      price: 577.75,
      net: "+18.08%",
      day: "+0.32%",
    },
  ];

  try {
    const inserted = await HoldingsModel.insertMany(tempHoldings);
    res.send(`Holdings added successfully (${inserted.length})`);
  } catch (error) {
    console.error("Error inserting holdings:", error);
    res.status(500).send(error.message);
  }
});

app.get("/addPositions", async (req, res) => {
  const tempPositions = [
    {
      product: "CNC",
      name: "EVEREADY",
      qty: 2,
      avg: 316.27,
      price: 312.35,
      net: "+0.58%",
      day: "-1.24%",
      isLoss: true,
    },
    {
      product: "CNC",
      name: "JUBLFOOD",
      qty: 1,
      avg: 3124.75,
      price: 3082.65,
      net: "+10.04%",
      day: "-1.35%",
      isLoss: true,
    },
  ];

  try {
    const inserted = await PositionsModel.insertMany(tempPositions);
    res.send(`Positions added successfully (${inserted.length})`);
  } catch (error) {
    console.error("Error inserting positions:", error);
    res.status(500).send(error.message);
  }
});

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

// alias for frontend compatibility
app.get("/holdings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    console.log(`GET /holdings -> returning ${allHoldings.length} documents`);
    res.json(allHoldings);
  } catch (err) {
    console.error("Error fetching holdings:", err);
    res.status(500).json({ error: err.message });
  }
});

// Server-Sent Events (SSE) streaming endpoint for real-time holdings updates
app.get("/stream/holdings", async (req, res) => {
  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders && res.flushHeaders();

  // Send a comment to keep connection alive in some proxies
  res.write(`: connected\n\n`);

  // Send initial data
  try {
    const initial = await HoldingsModel.find({});
    res.write(`data: ${JSON.stringify(initial)}\n\n`);
  } catch (err) {
    console.error("Error sending initial holdings:", err);
  }

  // Create change stream on the holdings collection
  const changeStream = HoldingsModel.watch([], { fullDocument: "updateLookup" });

  const changeHandler = async (change) => {
    try {
      // When any change occurs, send the full current set to clients
      const all = await HoldingsModel.find({});
      res.write(`data: ${JSON.stringify(all)}\n\n`);
      console.log(`SSE: pushed ${all.length} holdings due to change: ${change.operationType}`);
    } catch (err) {
      console.error("Error during changeStream handler:", err);
    }
  };

  changeStream.on("change", changeHandler);

  req.on("close", () => {
    try {
      changeStream.removeListener("change", changeHandler);
      changeStream.close();
    } catch (err) {
      console.error("Error closing changeStream:", err);
    }
  });
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.get("/orders", async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({});
    console.log(`GET /orders -> returning ${allOrders.length} orders`);
    res.json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });

    const savedOrder = await newOrder.save();
    console.log("Saved new order:", savedOrder);
    res.status(201).json({ message: "Order saved!", order: savedOrder });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: error.message });
  }
});

const startServer = async () => {
  try {
    await mongoose.connect(uri);
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`App started on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;