require("dotenv").config()

import { HederaClient } from "../lib/client"
import { getAccount, getMyAccount } from "../lib/accounts"
import { Hbar, HbarUnit, KeyList, ScheduleId, Timestamp, TransactionId } from "@hashgraph/sdk"
import { Transaction } from "@hashgraph/hethers"

async function main() {

    const acc1 = getAccount(1)
    const acc2 = getAccount(2)
    
    const myaccount = getMyAccount()
    const client = new HederaClient(myaccount)


    let balance = await client.getBalance(acc1)
    console.log(balance.hbars.toString())
    let res = await client.scheduleTransaction(myaccount, acc1, acc2, Hbar.from(2, HbarUnit.Hbar), "my memo19")
    console.log("Scheduled Transaction with scheduleId: " + res.scheduleId + " and transactionId: " + res.transactionId + "\n")

    balance = await client.getBalance(acc1)
    console.log(balance.hbars.toString())
    let info = await client.retrieveScheduldedTransactionInformation(res.scheduleId as ScheduleId)
    console.log("Scheduled Transaction %s has %sbeen executed", info.scheduleMemo, info.executed == null ? "not " : "")

    let status = await client.deleteTransaction(acc1, res.scheduleId as ScheduleId)
    console.log("Deleted Transaction with scheduleId: " + res.scheduleId + "with status: " + status.toString())
    
    try {
        status = await client.signScheduledTransaction(acc1, res.scheduleId as ScheduleId)
        console.log("Executed transaction for scheduleId: " + res.scheduleId)
    } catch(e: any) {
        console.log("Could not execute transaction for scheduleId " + res.scheduleId + ". Error: " + e.status.toString())
    }

    process.exit()
}
main()