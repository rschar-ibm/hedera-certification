import { Hbar, Key, PrivateKey, Status, AccountId, PublicKey, TokenId, AccountBalance, TransactionId, TopicId, ScheduleId, ContractFunctionParameters, ContractId, ContractFunctionResult, ScheduleInfo, KeyList } from '@hashgraph/sdk';
import { Account } from './accounts';
export declare class HederaClient {
    client: any;
    constructor(account: Account);
    createAccount(privateKey: PrivateKey, publicKey: Key, initialBalance?: number): Promise<Account>;
    createAccountFromList(keys: KeyList, initialBalance?: number): Promise<AccountId | null>;
    createToken(name: string, symbol: string, treasuryAcc: Account, initialSupply: number): Promise<TokenId | null>;
    getBalance(account: Account): Promise<AccountBalance>;
    associateAccountWithToken(account: Account, tokenId: TokenId): Promise<Status>;
    sellToken(from: Account, to: Account, tokenId: TokenId, amount: number, price: Hbar): Promise<Status>;
    spend(from: AccountId, to: AccountId, amount: Hbar, keys: {
        "privateKey": PrivateKey;
        "publicKey": PublicKey;
    }[]): Promise<Status>;
    createAllowance(owner: Account, spender: Account, amount: Hbar): Promise<Status>;
    createTopic(account: Account): Promise<TopicId | null>;
    sendMessage(account: Account, topicId: TopicId, message: string): Promise<Status>;
    scheduleTransaction(escrow: Account, from: Account, to: Account, amount: Hbar, memo: string): Promise<{
        "scheduleId": ScheduleId | null;
        "transactionId": TransactionId | null;
    }>;
    retrieveScheduldedTransactionInformation(scheduleId: ScheduleId): Promise<ScheduleInfo>;
    signScheduledTransaction(acc1: Account, scheduleId: ScheduleId): Promise<Status>;
    deleteTransaction(acc: Account, scheduleId: ScheduleId): Promise<Status>;
    deploySmartContract(acc: Account, bytecode: any): Promise<ContractId | null>;
    executeSmartContractFunction(acc: Account, contractId: ContractId, func: string, params: ContractFunctionParameters, payableAmount: Hbar): Promise<ContractFunctionResult | null>;
    deleteSmartContract(contractId: ContractId, acc: Account): Promise<Status>;
}
