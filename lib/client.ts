import { hethers } from '@hashgraph/hethers';
import { Client, AccountCreateTransaction, Hbar, Key, TokenAssociateTransaction, PrivateKey, Status, TokenCreateTransaction, TokenType, AccountId, PublicKey, TokenId, HbarUnit, AccountBalanceQuery, AccountBalance, TransferTransaction, TokenPauseTransaction, TokenUnpauseTransaction, AccountAllowanceApproveTransaction, TransactionId, TopicMessageSubmitTransaction, ReceiptStatusError, TopicCreateTransaction, TopicId, ScheduleCreateTransaction, Transaction, ScheduleId, FileCreateTransaction, ContractCreateTransaction, ContractFunctionParameters, FileId, ContractId, ContractCallQuery, ContractFunctionResult, ScheduleInfoQuery, ScheduleInfo, ContractDeleteTransaction, KeyList, ContractExecuteTransaction, ScheduleDeleteTransaction, Timestamp, ScheduleSignTransaction } from '@hashgraph/sdk';
import { Account } from './accounts'

export class HederaClient {
    client: any;

    constructor(account: Account) {
        const client = Client.forTestnet();

        // Set the operator to my account
        client.setOperator(account.accountId, account.privateKey);

        this.client = client;
    }

    async createAccount(privateKey: PrivateKey, publicKey: Key, initialBalance: number = 10): Promise<Account> {
        const newAccount = await new AccountCreateTransaction()
        .setKey(publicKey)
        .setInitialBalance(Hbar.from(initialBalance, HbarUnit.Hbar))
        .execute(this.client);

        // Get the new account ID
        const getReceipt = await newAccount.getReceipt(this.client);
        const newAccountId = getReceipt.accountId;

        return {
            privateKey: privateKey,
            publicKey: publicKey,
            accountId: newAccountId
        } as Account;
    }

    async createAccountFromList(keys: KeyList, initialBalance: number = 10): Promise<AccountId | null> {
        const newAccount = await new AccountCreateTransaction()
        .setKey(keys)
        .setInitialBalance(Hbar.from(initialBalance, HbarUnit.Hbar))
        .execute(this.client);

        // Get the new account ID
        const getReceipt = await newAccount.getReceipt(this.client);
        const newAccountId = getReceipt.accountId;

        return newAccountId
    }

    //create Token...
    async createToken(name: string, symbol: string, treasuryAcc: Account, initialSupply: number): Promise<TokenId | null>{
        const transaction = await new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setTokenType(TokenType.FungibleCommon)
        .setTreasuryAccountId(treasuryAcc.accountId)
        .setInitialSupply(initialSupply)
        .freezeWith(this.client);

        //Sign the transaction with the client, who is set as admin and treasury account
        const signTx =  await transaction.sign(treasuryAcc.privateKey);

        //Submit to a Hedera network
        const txResponse = await signTx.execute(this.client);

        //Get the receipt of the transaction
        const receipt = await txResponse.getReceipt(this.client);

        //Get the token ID from the receipt
        return receipt.tokenId;
    }

    async getBalance(account: Account): Promise<AccountBalance> {
        const query = new AccountBalanceQuery().setAccountId(account.accountId);

        // Sign with the client operator account private key and submit to a Hedera network
        return query.execute(this.client);
    }

    async associateAccountWithToken(account: Account, tokenId: TokenId): Promise<Status> {
         //  Before an account that is not the treasury for a token can receive or send this specific token ID, the account
        //  must become “associated” with the token.
        let associateTx = await new TokenAssociateTransaction()
        .setAccountId(account.accountId)
        .setTokenIds([tokenId])
        .freezeWith(this.client)
        .sign(account.privateKey)

        //SUBMIT THE TRANSACTION
        let associateOtherWalletTxSubmit = await associateTx.execute(this.client);

        //GET THE RECEIPT OF THE TRANSACTION
        let associateOtherWalletRx = await associateOtherWalletTxSubmit.getReceipt(this.client);

        return associateOtherWalletRx.status
    }

    async sellToken(from: Account, to: Account, tokenId: TokenId, amount: number, price: Hbar): Promise<Status> {
        const transaction = await new TransferTransaction()
        .addTokenTransfer(tokenId, from.accountId, -amount)
        .addTokenTransfer(tokenId, to.accountId, amount)
        .addHbarTransfer(to.accountId, price.negated())
        .addHbarTransfer(from.accountId, price)
        .freezeWith(this.client);

        //Sign with both accounts private keys
        const signTx =  await (await transaction.sign(from.privateKey)).sign(to.privateKey);

        //Submit to a Hedera network
        const txResponse = await signTx.execute(this.client);

        //Request the receipt of the transaction
        const receipt = await txResponse.getReceipt(this.client);

        //Obtain the transaction consensus status
        return receipt.status;
    }

    async spend(from: AccountId, to: AccountId, amount: Hbar, keys: { "privateKey": PrivateKey, "publicKey": PublicKey}[]): Promise<Status> {
        let transaction = new TransferTransaction()
        .addHbarTransfer(from, amount.negated())
        .addHbarTransfer(to, amount)
        .setNodeAccountIds([new AccountId(3)])
        .freezeWith(this.client)
        
        for(let key of keys) {
            let sig = key.privateKey.signTransaction(transaction)
            transaction = transaction.addSignature(key.publicKey, sig)
        }

        //Sign with the client operator private key and submit to a Hedera network
        const txResponse = await transaction.execute(this.client);

        //Request the receipt of the transaction
        const receipt = await txResponse.getReceipt(this.client);

        //Obtain the transaction consensus status
        return receipt.status;
    }

    async createAllowance(owner: Account, spender: Account, amount: Hbar): Promise<Status> {
        //Create the transfer transaction
        let transaction = new AccountAllowanceApproveTransaction()
        .approveHbarAllowance(owner.accountId, spender.accountId, amount)
        .freezeWith(this.client)
        
        //Sign with the sender account private key
        const signTx =  await transaction.sign(owner.privateKey);
        
        //Sign with the client operator private key and submit to a Hedera network
        const txResponse = await signTx.execute(this.client);

        //Request the receipt of the transaction
        const receipt = await txResponse.getReceipt(this.client);

        //Obtain the transaction consensus status
        return receipt.status;
    }

    async createTopic(account: Account): Promise<TopicId | null> {
        let transaction = new TopicCreateTransaction()
            .setSubmitKey(account.publicKey)
            .setAdminKey(account.privateKey)
            .freezeWith(this.client)

        const signTx = await transaction.sign(account.privateKey)
    
        //Get the receipt of the transaction
        const txResponse = await signTx.execute(this.client);

        //Request the receipt of the transaction
        const receipt = await txResponse.getReceipt(this.client);
    
        return receipt.topicId
    }

    async sendMessage(account: Account, topicId: TopicId, message: string): Promise<Status> {
        const transaction = await new TopicMessageSubmitTransaction({
            topicId: topicId,
            message: message,
        }).freezeWith(this.client)

        const signTx = await transaction.sign(account.privateKey)
    
        //Get the receipt of the transaction
        const txResponse = await signTx.execute(this.client);

        //Request the receipt of the transaction
        const receipt = await txResponse.getReceipt(this.client);
    
        return receipt.status
    }

    async scheduleTransaction(escrow: Account, from: Account, to: Account, amount: Hbar, memo: string): Promise<{ "scheduleId": ScheduleId | null, "transactionId": TransactionId | null}> {

        //Create a transaction to schedule
        const transaction = await new TransferTransaction()
        .addHbarTransfer(from.accountId, amount.negated())
        .addHbarTransfer(to.accountId, amount)

        //Schedule the transaction
        const scheduledTransaction = new ScheduleCreateTransaction()
            .setScheduledTransaction(transaction)
            .setScheduleMemo(memo)
            .setAdminKey(escrow.publicKey)
            .setExpirationTime(Timestamp.generate().plusNanos(10000*10000*100))
            .setWaitForExpiry(true)
            .freezeWith(this.client)

        const signScheduledTx = await scheduledTransaction.sign(escrow.privateKey)

        const txResponse = await signScheduledTx.execute(this.client)

        const receipt = await txResponse.getReceipt(this.client);

        return { "scheduleId": receipt.scheduleId, "transactionId": receipt.scheduledTransactionId }
    }

    async retrieveScheduldedTransactionInformation(scheduleId: ScheduleId): Promise<ScheduleInfo> {
        const query = new ScheduleInfoQuery()
            .setScheduleId(scheduleId);

        return query.execute(this.client);
    }

    async signScheduledTransaction(acc1: Account, scheduleId: ScheduleId): Promise<Status> {
        const signedTx = await new ScheduleSignTransaction()
            .setScheduleId(scheduleId)
            .freezeWith(this.client)
            .sign(acc1.privateKey)

        const txResponse = await signedTx.execute(this.client)

        const receipt = await txResponse.getReceipt(this.client);

        return receipt.status
    }

    async deleteTransaction(acc: Account, scheduleId: ScheduleId): Promise<Status> {
        let signedTx = await new ScheduleDeleteTransaction()
        .setScheduleId(scheduleId)
        .freezeWith(this.client)
        .sign(acc.privateKey)

        const txResponse = await signedTx.execute(this.client)

        const receipt = await txResponse.getReceipt(this.client);

        return receipt.status
    }

    async deploySmartContract(acc: Account, bytecode: any): Promise<ContractId | null> {

        //Create a file on Hedera and store the hex-encoded bytecode
        const fileCreateTx = await new FileCreateTransaction()
            //Set the bytecode of the contract
            .setContents(bytecode)
            .freezeWith(this.client)
            .sign(acc.privateKey)

        //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
        const submitTx = await fileCreateTx.execute(this.client);

        //Get the receipt of the file create transaction
        const fileReceipt = await submitTx.getReceipt(this.client);

        //Get the file ID from the receipt
        const bytecodeFileId = fileReceipt.fileId;
        // if error -> throw exception

        //Log the file ID
        console.log("The smart contract byte code file ID is " + bytecodeFileId)

        // Instantiate the contract instance
        const contractTx = new ContractCreateTransaction()
            //Set the file ID of the Hedera file storing the bytecode
            .setBytecodeFileId(bytecodeFileId as FileId)
            //Set the gas to instantiate the contract
            .setGas(100000)
            
            .setAdminKey(acc.publicKey)
            .freezeWith(this.client)

        const signedTx = await contractTx.sign(acc.privateKey)

        //Submit the transaction to the Hedera test network
        const contractResponse = await signedTx.execute(this.client);

        //Get the receipt of the file create transaction
        const contractReceipt = await contractResponse.getReceipt(this.client);

        //Get the smart contract ID
        return contractReceipt.contractId;
    }

    async executeSmartContractFunction(acc: Account, contractId: ContractId, func: string, params: ContractFunctionParameters, payableAmount: Hbar): Promise<ContractFunctionResult | null> {
        let contractTransaction = await new ContractExecuteTransaction()
        //Set the ID of the contract to query
        .setContractId(contractId)
        //Set the gas to execute the contract call
        .setGas(100000)
        //Set the contract function to call
        .setFunction(func, params)
        //Set the query payment for the node returning the request
        //This value must cover the cost of the request otherwise will fail
        .freezeWith(this.client)
        .sign(acc.privateKey)
        
        //Submit the transaction to a Hedera network
        let res = await contractTransaction.execute(this.client);
        return (await res.getRecord(this.client)).contractFunctionResult
    }

    async deleteSmartContract(contractId: ContractId, acc: Account): Promise<Status> {
        const transaction = new ContractDeleteTransaction()
            .setContractId(contractId)
            .setTransferAccountId(acc.accountId)
            .freezeWith(this.client);

        //Sign with the admin key on the contract
        const signTx = await transaction.sign(acc.privateKey)

        //Sign the transaction with the client operator's private key and submit to a Hedera network
        const txResponse = await signTx.execute(this.client);

        //Get the receipt of the transaction
        const receipt = await txResponse.getReceipt(this.client);

        return receipt.status
    }
}