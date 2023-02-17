import { AccountId, PrivateKey, PublicKey } from "@hashgraph/sdk"

const fs = require('fs') 
const { parse, stringify } = require('envfile')

export type Account = {
    privateKey: PrivateKey
    publicKey: PublicKey
    accountId: AccountId
}

export function addAccount(num: number, account: Account) {
    const file = fs.readFileSync('./.env')
    let parsedFile = parse(file)
    parsedFile[`PRIVATE_KEY_${num}`] = account.privateKey.toStringDer()
    parsedFile[`PUBLIC_KEY_${num}`] = account.publicKey?.toStringDer()
    parsedFile[`ACCOUNT_ID_${num}`] = account.accountId.toString()

    fs.writeFileSync('./.env', stringify(parsedFile))
}

export function getAccount(num: number): Account {
    const file = fs.readFileSync('./.env')
    let parsedFile = parse(file);

    return {
        privateKey: PrivateKey.fromString(parsedFile[`PRIVATE_KEY_${num}`]), 
        publicKey: PublicKey.fromString(parsedFile[`PUBLIC_KEY_${num}`]), 
        accountId: AccountId.fromString(parsedFile[`ACCOUNT_ID_${num}`])
    }
}

export function getMyAccount(): Account {
    const file = fs.readFileSync('./.env')
    let parsedFile = parse(file);

    return {
        privateKey: PrivateKey.fromString(parsedFile[`MY_PRIVATE_KEY`]), 
        publicKey: PublicKey.fromString(parsedFile[`MY_PUBLIC_KEY`]), 
        accountId: AccountId.fromString(parsedFile[`MY_ACCOUNT_ID`])
    }
}