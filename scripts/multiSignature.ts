require("dotenv").config()

import { HederaClient } from "../lib/client"
import { getAccount, getMyAccount } from "../lib/accounts"
import { AccountCreateTransaction, AccountId, Hbar, HbarUnit, KeyList, TokenId } from "@hashgraph/sdk"

async function main() {

    const acc1 = getAccount(1)
    const acc2 = getAccount(2)
    const acc3 = getAccount(3)
    const acc4 = getAccount(4)

    const keyList = new KeyList([acc1.publicKey, acc2.publicKey, acc3.publicKey]).setThreshold(2);

    const myaccount = getMyAccount()
    const client = new HederaClient(myaccount)

    const multiAccountId = await client.createAccountFromList(keyList, 20)
    console.log("Created a multiAccount for account 1,2,3 with id " + multiAccountId)

    try {
        let status = await client.spend(multiAccountId as AccountId, acc4.accountId, Hbar.from(10, HbarUnit.Hbar), [{ "privateKey": acc1.privateKey, "publicKey": acc1.publicKey}])
        console.log(status)
    } catch(e: any) {
        console.log(`Spending failed from multi account to transfer 20 HBar to acc3 using signature from acc1\n` + e)
    }
    try {
        let status = await client.spend(multiAccountId as AccountId, acc4.accountId, Hbar.from(10, HbarUnit.Hbar), [{ "privateKey": acc1.privateKey, "publicKey": acc1.publicKey}, { "privateKey": acc2.privateKey, "publicKey": acc2.publicKey}])
        console.log(`Spending successful for multi-account to transfer 10 HBar to acc4 using signaturo from acc1 and acc2\n`);
    } catch(e: any) {
        console.log(`Spending failed from multi account to transfer 20 HBar to acc3 using signature from acc1 and acc2\n` + e);
    }
    
    process.exit()
}

main()