import { connect } from "nats";
const SUBJECT = "orders";
import express from "express";
import "dotenv/config";
const app = express();
import activityService from "../src/models/activity/activity.service";
import { connectDB } from "../src/config/DB.config";




async function runSubscriber() {
  let nc;
  try {
    nc = await connect({ servers: process.env.NATS_URL });
    console.log(`connect successfully to ${nc.getServer()}`);
    const subscription = nc.subscribe(SUBJECT);

    console.log(`i lesten to ${SUBJECT}`);
    for await (const msg of subscription) {
      const data = msg.data.toString();
      try {
        const order = JSON.parse(data);
        console.log(`new order has been received`);
        console.log(order);
        activityService.createOne(order);
      } catch (e) {
        console.error(e);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (nc) {
      await nc.close();
    }
  }
}

runSubscriber();

app.get("/log", async (req, res, next) => {
  const data = await activityService.getAll();
  console.log(data);
  res.send(data);
});

app.listen(parseInt(process.env.PORT || '3000'), '0.0.0.0', async () => {
  await connectDB();
  console.log(`server is running on port ${process.env.PORT}`);
});
