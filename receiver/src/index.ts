import { connect } from "nats";
const SUBJECT1 = "LogActivity";
const SUBJECT2 = "GetLogs";
import "dotenv/config";
import {ActivityService} from "../src/models/activity/activity.service";
import { connectDB } from "@config/DB.config";

async function runSubscriber() {
  let nc;
  try {

     await connectDB();
    console.log(`Connected to DB`);

    nc = await connect({ servers: process.env.NATS_URL });
    console.log(`connect successfully to ${nc.getServer()}`);

    const subscription = nc.subscribe(SUBJECT1);
    console.log(`i lesten to ${SUBJECT1}`);

    const pingSub = nc.subscribe(SUBJECT2);
    console.log(`i listen to request subject: ${SUBJECT2}`);

   (async () => {
        console.log(`Starting listener for ${SUBJECT1}`);
        for await (const msg of subscription) {
            const data = msg.data.toString();
            const activityService = new ActivityService();
            try {
                const newLog = JSON.parse(data);
                console.log(`\n--- New Log Activity Received ---`);
                console.log(newLog);
                await activityService.createOne(newLog);
                console.log(`--- Log Activity Processed ---\n`);
            } catch (e) {
                console.error(e);
            }
        }
    })();

    for await (const msg of pingSub) {
        const requestData = msg.data.toString();
        const body = JSON.parse(requestData);
        const query = body.query; 
        const date = body.date;
        const activityService = new ActivityService(date);
        console.log(`\n>>> Received Request: ${requestData} on ${SUBJECT2}`);
        const response = await activityService.getAll(query);
        console.log(`>>> Sending Response: ${JSON.stringify(response)} on ${SUBJECT2}`);
        msg.respond(JSON.stringify(response));
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
