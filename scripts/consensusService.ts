require("dotenv").config()

import { HederaClient } from "../lib/client"
import { getAccount, getMyAccount } from "../lib/accounts"
import { Hbar, HbarUnit, TokenId, TopicId } from "@hashgraph/sdk"

async function main() {

    const acc1 = getAccount(1)
    const acc2 = getAccount(2)

    const myaccount = getMyAccount()
    const client = new HederaClient(myaccount)

    // Create the topic
    const topicId = await client.createTopic(acc1)
    if(topicId == null) {
        console.log(`Could not create topic: \n`);
    } else {
        console.log(`Created topic: my-topic with id ` + topicId);
    }

    // Send the message
    const date = new Date().toUTCString()
    let status = await client.sendMessage(acc1, topicId as TopicId, date)
    console.log(`Sent ${date} : ${status} \n`);

    // Retry unauthorized
    try {
        status = await client.sendMessage(acc2, topicId as TopicId, date)
        console.log(`Sent ${date} : ${status} \n`);
    } catch(e: any) {
        console.log("Could not send to topic with wrong authroization " + e.status.toString())
    }

    process.exit()
}
main()