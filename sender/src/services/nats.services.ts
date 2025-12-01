interface getDateBody{
        query:any,
        date?:string
}

export async function sendData(natsClient:any, data:any , subject:string) {
        const dataToSend = JSON.stringify(data);
        natsClient.publish(subject, Buffer.from(dataToSend));
         await natsClient.flush();
}

export async function getData(natsClient:any, subject:string , body:getDateBody) {
        const timeout = 5000;
        const bodyString = JSON.stringify(body);
        const response = await natsClient.request(subject, Buffer.from(bodyString), { timeout });
        const responseData = JSON.parse(response.data.toString());
        return responseData;
}