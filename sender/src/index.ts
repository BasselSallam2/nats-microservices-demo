import { connect } from "nats";
import { getData , sendData } from "services/nats.services";


const NATS_URL = process.env.NATS_URL;
const SUBJECT1 = "LogActivity";
const SUBJECT2 = "GetLogs";

async function runPublisher() {
  let nc;
  try {
    nc = await connect({ servers: NATS_URL });
    console.log(`connect successfully to ${nc.getServer()}`);
    console.log(`sender is listen`);

    // const orderDetails = {
    //   eventType: "USER20_LOGIN_SUCCESS",
    //   timestamp: "2025-12-01T07:56:36.000Z",
    //   actorType: "User",
    //   actorId: "65691062089cfd342c8d281e",
    //   actorName: "john.doe",
    //   targetType: "Auth",
    //   targetId: null,
    //   metadata: {
    //     loginMethod: "Password",
    //     sessionId: "a8b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7",
    //   },
    //   location: {
    //     ipAddress: "192.168.1.100",
    //     platform: "Web Browser (Chrome)",
    //   },
    // };

    // await sendData(nc, orderDetails, SUBJECT1);

    const data = await getData(nc , SUBJECT2 , {query:{eventType:"USER19_LOGIN_SUCCESS"} , date:"2025-12-01"});
    console.log(data);

  } catch (err) {
    console.log(`could not publish: ${err}`);
  } finally {
    if (nc) {
      await nc.close();
    }
  }
}

runPublisher();
