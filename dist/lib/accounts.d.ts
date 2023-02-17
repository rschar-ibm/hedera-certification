import { AccountId, PrivateKey, PublicKey } from "@hashgraph/sdk";
export type Account = {
    privateKey: PrivateKey;
    publicKey: PublicKey;
    accountId: AccountId;
};
export declare function addAccount(num: number, account: Account): void;
export declare function getAccount(num: number): Account;
export declare function getMyAccount(): Account;
