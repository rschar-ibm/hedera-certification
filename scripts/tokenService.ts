require("dotenv").config()

import { HederaClient } from "../lib/client"
import { getAccount, getMyAccount } from "../lib/accounts"
import { Hbar, HbarUnit, TokenId } from "@hashgraph/sdk"

async function main() {

    // Retrieve required account information
    const acc1 = getAccount(1)
    const acc2 = getAccount(2)

    // Connect with client using my account
    const myaccount = getMyAccount()
    const client = new HederaClient(myaccount)

    // Create a token with a supply of 1000 using account 1 as treasury
    const tokenId = await client.createToken("Awesome Game Token", "AGT", acc1, 1000)
    if(tokenId == null) {
        console.log("could not create token")
        process.exit()
    }
    console.log("Created token with id: " + tokenId?.toString())

    // Associate account 2 with the token
    let status = await client.associateAccountWithToken(acc2, tokenId as TokenId)
    console.log(`Token association with acc2 was : ${status} \n`);

    const balance = await client.getBalance(acc1)
    console.log("Balance acc1: " + balance)

    // Sell 150 tokens from acc1 to acc2 for 10 Hbar
    try {
        status = await client.sellToken(acc1, acc2, tokenId, 150, Hbar.from(10, HbarUnit.Hbar))
        console.log(`Transferred 150 AGT from acc1 to acc2 for 10 HBar with status : ${status} \n`);
    } catch(e) {
        console.log(`Could not sell token : ${e} \n`);
    }


    const balance1 = await client.getBalance(acc1)
    const balance2 = await client.getBalance(acc2)

    console.log("Balance acc1: " + balance1)
    console.log("Balance acc2: " + balance2)
    
    process.exit()
}

main()