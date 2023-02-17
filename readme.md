# Tasks

## Setup

Created account 1
Private Key: 2facebd2648e5859a47a90c77ff0c4f21ae78a44f6dab22a77b11a1cf91669b8
Public Key: 9be23d4a1457eaccd8e7a2e4c99c0dd550d396ffa4aa812420804da1d17195db
AccountId: 0.0.3507109
Balance: {"hbars":"100 ℏ","tokens":[]}

Created account 2
Private Key: 246968cabd5a34296e89f877c5a2c8ea20eaa0e143c2e6eda58af76a3459f1f7
Public Key: 7b19100f3803fb6e2ea1be8b182ee060ce9aab040648ed6014f2096a42c84b63
AccountId: 0.0.3507110
Balance: {"hbars":"100 ℏ","tokens":[]}

Created account 3
Private Key: 629736d6e44c5a9fe8d09cb621941d75388b829342e95bd7d94ee54089375f3c
Public Key: 1813dcdfd8e6b0d072fa10402a93f393ba00e97aef59a2b1aeab1198e6897d13
AccountId: 0.0.3507111
Balance: {"hbars":"100 ℏ","tokens":[]}

Created account 4
Private Key: fb3d743e9bf8a63b62f4ad585a466a1c4bf3647d7261aad37a2928b71188077e
Public Key: a9ee75cdd9c6a97fd7b7d5baf3b53908bc450af437b27ec8a2234380acafcbd5
AccountId: 0.0.3507112
Balance: {"hbars":"100 ℏ","tokens":[]}

Created account 5
Private Key: 5de04e7bce77747529b7fca6654be11831eaf8415e6f2d1e64a6da980fced0da
Public Key: c3eea392b6b26a7f2bb088b47f6dd726110672427dd3e6c92cd847bf58a4f0bd
AccountId: 0.0.3507113
Balance: {"hbars":"100 ℏ","tokens":[]}


## Token Service

Created token with id: 0.0.3507115
Token association with acc2 was : SUCCESS 

Balance acc1: {"hbars":"100 ℏ","tokens":[{"tokenId":"0.0.3507115","balance":"1000","decimals":0}]}
Transferred 150 AGT from acc1 to acc2 for 10 HBar with status : SUCCESS 

Balance acc1: {"hbars":"110 ℏ","tokens":[{"tokenId":"0.0.3507115","balance":"850","decimals":0}]}
Balance acc2: {"hbars":"90 ℏ","tokens":[{"tokenId":"0.0.3507115","balance":"150","decimals":0}]}

## Smart Contract

Loading Smart contract
Deploying Smart contract
The smart contract byte code file ID is 0.0.3507116
The smart contract ID is 0.0.3507117
Executing function1 with parameters 5 and 6
Result of function1: 30
Deleting smartcontract with id: 0.0.3507117
Deletion was: SUCCESS

## Scheduled Transaction

110 ℏ
Scheduled Transaction with scheduleId: 0.0.3507119 and transactionId: 0.0.1715@1676647641.120540077?scheduled

110 ℏ
Scheduled Transaction my memo19 has not been executed
Deleted Transaction with scheduleId: 0.0.3507119with status: SUCCESS
Could not execute transaction for scheduleId 0.0.3507119. Error: SCHEDULE_ALREADY_DELETED

## Multi-Signature

Created a multiAccount for account 1,2,3 with id 0.0.3507122
Spending failed from multi account to transfer 20 HBar to acc3 using signature from acc1
{"name":"StatusError","status":"INVALID_SIGNATURE","transactionId":"0.0.1715@1676647674.699697805","message":"receipt for transaction 0.0.1715@1676647674.699697805 contained error status INVALID_SIGNATURE"}
Spending successful for multi-account to transfer 10 HBar to acc4 using signaturo from acc1 and acc2

## Consensus

Created topic: my-topic with id 0.0.3507124
Sent Fri, 17 Feb 2023 15:28:33 GMT : SUCCESS 

Could not send to topic with wrong authroization INVALID_SIGNATURE
