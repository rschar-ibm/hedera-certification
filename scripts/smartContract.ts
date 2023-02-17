require("dotenv").config()

import { ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, ContractFunctionResult, ContractId, Hbar, HbarUnit } from "@hashgraph/sdk";
import { getAccount, getMyAccount } from "../lib/accounts";
import { HederaClient } from "../lib/client";

async function main() {

    const acc1 = getAccount(1)
    
    const myaccount = getMyAccount()
    const client = new HederaClient(myaccount)

    console.log("Loading Smart contract")
    // Info: The name of the smart contract file is CertificationC3.sol, but the actual smart contract within the file is called CertificationC1
    let esealCompiled = require("../../solidity/artifacts/contracts/certificationC3.sol/CertificationC1.json");
    const bytecode = esealCompiled.bytecode;

    console.log("Deploying Smart contract")
    let res = await client.deploySmartContract(acc1, bytecode)

    //Log the smart contract ID
    console.log("The smart contract ID is " + res);


    console.log("Executing function1 with parameters 5 and 6");
    //Query the contract for the contract message
    let contractCallQuery = new ContractExecuteTransaction()
    //Set the ID of the contract to query
    .setContractId(res as ContractId)
    //Set the gas to execute the contract call
    .setGas(100000)
    //Set the contract function to call
    .setFunction("function1", new ContractFunctionParameters().addUint16(5).addUint16(6))
    //Set the query payment for the node returning the request
    //This value must cover the cost of the request otherwise will fail
    .setPayableAmount(new Hbar(10));

    let contractResult = await client.executeSmartContractFunction(acc1, res as ContractId, "function1", new ContractFunctionParameters().addUint16(5).addUint16(6), Hbar.from(10, HbarUnit.Hbar))
    
    if (contractResult == null) {
        console.log("Something went wrong")
    }
    contractResult = contractResult as ContractFunctionResult
    const result = contractResult.getUint32(0);
    //Log the updated message to the console
    console.log("Result of function1: " + result);

    console.log("Deleting smartcontract with id: " + res)
    let status = await client.deleteSmartContract(res as ContractId, acc1)
    console.log("Deletion was: " + status.toString())

    process.exit()
}

main()