require("dotenv").config();

import { HederaClient } from "../lib/client"
import { addAccount, Account, getMyAccount } from "../lib/accounts"
import { AccountBalanceQuery, AccountId, PrivateKey } from "@hashgraph/sdk";

async function main() {

    const myaccount = getMyAccount()
    const client = new HederaClient(myaccount)

    // We create 5 accounts
    for(let i = 0; i < 5; i++) {
        // Generate a public/private key pair for the new account
        const newAccountPrivateKey = PrivateKey.generateED25519(); 
        const newAccountPublicKey = newAccountPrivateKey.publicKey;

        // Create the account with 1000 HBar
        const acc = await client.createAccount(newAccountPrivateKey, newAccountPublicKey, 100)

        // Save account in .env
        addAccount(i+1, acc);
        const balance = await client.getBalance(acc)

        // Print all required information
        console.log("Created account " + (i+1));
        console.log("Private Key: " + acc.privateKey.toStringRaw());
        console.log("Public Key: " + acc.publicKey?.toStringRaw());
        console.log("AccountId: " +acc.accountId.toString());
        console.log("Balance: " + balance)
        console.log("----")
    }

    process.exit();
}

main();