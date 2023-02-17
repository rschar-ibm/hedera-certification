"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HederaClient = void 0;
var sdk_1 = require("@hashgraph/sdk");
var HederaClient = /** @class */ (function () {
    function HederaClient(account) {
        var client = sdk_1.Client.forTestnet();
        // Set the operator to my account
        client.setOperator(account.accountId, account.privateKey);
        this.client = client;
    }
    HederaClient.prototype.createAccount = function (privateKey, publicKey, initialBalance) {
        if (initialBalance === void 0) { initialBalance = 10; }
        return __awaiter(this, void 0, void 0, function () {
            var newAccount, getReceipt, newAccountId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sdk_1.AccountCreateTransaction()
                            .setKey(publicKey)
                            .setInitialBalance(sdk_1.Hbar.from(initialBalance, sdk_1.HbarUnit.Hbar))
                            .execute(this.client)];
                    case 1:
                        newAccount = _a.sent();
                        return [4 /*yield*/, newAccount.getReceipt(this.client)];
                    case 2:
                        getReceipt = _a.sent();
                        newAccountId = getReceipt.accountId;
                        return [2 /*return*/, {
                                privateKey: privateKey,
                                publicKey: publicKey,
                                accountId: newAccountId
                            }];
                }
            });
        });
    };
    HederaClient.prototype.createAccountFromList = function (keys, initialBalance) {
        if (initialBalance === void 0) { initialBalance = 10; }
        return __awaiter(this, void 0, void 0, function () {
            var newAccount, getReceipt, newAccountId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sdk_1.AccountCreateTransaction()
                            .setKey(keys)
                            .setInitialBalance(sdk_1.Hbar.from(initialBalance, sdk_1.HbarUnit.Hbar))
                            .execute(this.client)];
                    case 1:
                        newAccount = _a.sent();
                        return [4 /*yield*/, newAccount.getReceipt(this.client)];
                    case 2:
                        getReceipt = _a.sent();
                        newAccountId = getReceipt.accountId;
                        return [2 /*return*/, newAccountId];
                }
            });
        });
    };
    //create Token...
    HederaClient.prototype.createToken = function (name, symbol, treasuryAcc, initialSupply) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, signTx, txResponse, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sdk_1.TokenCreateTransaction()
                            .setTokenName(name)
                            .setTokenSymbol(symbol)
                            .setTokenType(sdk_1.TokenType.FungibleCommon)
                            .setTreasuryAccountId(treasuryAcc.accountId)
                            .setInitialSupply(initialSupply)
                            .freezeWith(this.client)];
                    case 1:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.sign(treasuryAcc.privateKey)];
                    case 2:
                        signTx = _a.sent();
                        return [4 /*yield*/, signTx.execute(this.client)];
                    case 3:
                        txResponse = _a.sent();
                        return [4 /*yield*/, txResponse.getReceipt(this.client)];
                    case 4:
                        receipt = _a.sent();
                        //Get the token ID from the receipt
                        return [2 /*return*/, receipt.tokenId];
                }
            });
        });
    };
    HederaClient.prototype.getBalance = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                query = new sdk_1.AccountBalanceQuery().setAccountId(account.accountId);
                // Sign with the client operator account private key and submit to a Hedera network
                return [2 /*return*/, query.execute(this.client)];
            });
        });
    };
    HederaClient.prototype.associateAccountWithToken = function (account, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var associateTx, associateOtherWalletTxSubmit, associateOtherWalletRx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sdk_1.TokenAssociateTransaction()
                            .setAccountId(account.accountId)
                            .setTokenIds([tokenId])
                            .freezeWith(this.client)
                            .sign(account.privateKey)
                        //SUBMIT THE TRANSACTION
                    ];
                    case 1:
                        associateTx = _a.sent();
                        return [4 /*yield*/, associateTx.execute(this.client)];
                    case 2:
                        associateOtherWalletTxSubmit = _a.sent();
                        return [4 /*yield*/, associateOtherWalletTxSubmit.getReceipt(this.client)];
                    case 3:
                        associateOtherWalletRx = _a.sent();
                        return [2 /*return*/, associateOtherWalletRx.status];
                }
            });
        });
    };
    HederaClient.prototype.sellToken = function (from, to, tokenId, amount, price) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, signTx, txResponse, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sdk_1.TransferTransaction()
                            .addTokenTransfer(tokenId, from.accountId, -amount)
                            .addTokenTransfer(tokenId, to.accountId, amount)
                            .addHbarTransfer(to.accountId, price.negated())
                            .addHbarTransfer(from.accountId, price)
                            .freezeWith(this.client)];
                    case 1:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.sign(from.privateKey)];
                    case 2: return [4 /*yield*/, (_a.sent()).sign(to.privateKey)];
                    case 3:
                        signTx = _a.sent();
                        return [4 /*yield*/, signTx.execute(this.client)];
                    case 4:
                        txResponse = _a.sent();
                        return [4 /*yield*/, txResponse.getReceipt(this.client)];
                    case 5:
                        receipt = _a.sent();
                        //Obtain the transaction consensus status
                        return [2 /*return*/, receipt.status];
                }
            });
        });
    };
    HederaClient.prototype.spend = function (from, to, amount, keys) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, _i, keys_1, key, sig, txResponse, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transaction = new sdk_1.TransferTransaction()
                            .addHbarTransfer(from, amount.negated())
                            .addHbarTransfer(to, amount)
                            .setNodeAccountIds([new sdk_1.AccountId(3)])
                            .freezeWith(this.client);
                        for (_i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                            key = keys_1[_i];
                            sig = key.privateKey.signTransaction(transaction);
                            transaction = transaction.addSignature(key.publicKey, sig);
                        }
                        return [4 /*yield*/, transaction.execute(this.client)];
                    case 1:
                        txResponse = _a.sent();
                        return [4 /*yield*/, txResponse.getReceipt(this.client)];
                    case 2:
                        receipt = _a.sent();
                        //Obtain the transaction consensus status
                        return [2 /*return*/, receipt.status];
                }
            });
        });
    };
    HederaClient.prototype.createAllowance = function (owner, spender, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, signTx, txResponse, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transaction = new sdk_1.AccountAllowanceApproveTransaction()
                            .approveHbarAllowance(owner.accountId, spender.accountId, amount)
                            .freezeWith(this.client);
                        return [4 /*yield*/, transaction.sign(owner.privateKey)];
                    case 1:
                        signTx = _a.sent();
                        return [4 /*yield*/, signTx.execute(this.client)];
                    case 2:
                        txResponse = _a.sent();
                        return [4 /*yield*/, txResponse.getReceipt(this.client)];
                    case 3:
                        receipt = _a.sent();
                        //Obtain the transaction consensus status
                        return [2 /*return*/, receipt.status];
                }
            });
        });
    };
    HederaClient.prototype.createTopic = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, signTx, txResponse, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transaction = new sdk_1.TopicCreateTransaction()
                            .setSubmitKey(account.publicKey)
                            .setAdminKey(account.privateKey)
                            .freezeWith(this.client);
                        return [4 /*yield*/, transaction.sign(account.privateKey)
                            //Get the receipt of the transaction
                        ];
                    case 1:
                        signTx = _a.sent();
                        return [4 /*yield*/, signTx.execute(this.client)];
                    case 2:
                        txResponse = _a.sent();
                        return [4 /*yield*/, txResponse.getReceipt(this.client)];
                    case 3:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt.topicId];
                }
            });
        });
    };
    HederaClient.prototype.sendMessage = function (account, topicId, message) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, signTx, txResponse, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sdk_1.TopicMessageSubmitTransaction({
                            topicId: topicId,
                            message: message,
                        }).freezeWith(this.client)];
                    case 1:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.sign(account.privateKey)
                            //Get the receipt of the transaction
                        ];
                    case 2:
                        signTx = _a.sent();
                        return [4 /*yield*/, signTx.execute(this.client)];
                    case 3:
                        txResponse = _a.sent();
                        return [4 /*yield*/, txResponse.getReceipt(this.client)];
                    case 4:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt.status];
                }
            });
        });
    };
    HederaClient.prototype.scheduleTransaction = function (escrow, from, to, amount, memo) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, scheduledTransaction, signScheduledTx, txResponse, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sdk_1.TransferTransaction()
                            .addHbarTransfer(from.accountId, amount.negated())
                            .addHbarTransfer(to.accountId, amount)
                        //Schedule the transaction
                    ];
                    case 1:
                        transaction = _a.sent();
                        scheduledTransaction = new sdk_1.ScheduleCreateTransaction()
                            .setScheduledTransaction(transaction)
                            .setScheduleMemo(memo)
                            .setAdminKey(escrow.publicKey)
                            .setExpirationTime(sdk_1.Timestamp.generate().plusNanos(10000 * 10000 * 100))
                            .setWaitForExpiry(true)
                            .freezeWith(this.client);
                        return [4 /*yield*/, scheduledTransaction.sign(escrow.privateKey)];
                    case 2:
                        signScheduledTx = _a.sent();
                        return [4 /*yield*/, signScheduledTx.execute(this.client)];
                    case 3:
                        txResponse = _a.sent();
                        return [4 /*yield*/, txResponse.getReceipt(this.client)];
                    case 4:
                        receipt = _a.sent();
                        return [2 /*return*/, { "scheduleId": receipt.scheduleId, "transactionId": receipt.scheduledTransactionId }];
                }
            });
        });
    };
    HederaClient.prototype.retrieveScheduldedTransactionInformation = function (scheduleId) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                query = new sdk_1.ScheduleInfoQuery()
                    .setScheduleId(scheduleId);
                return [2 /*return*/, query.execute(this.client)];
            });
        });
    };
    HederaClient.prototype.signScheduledTransaction = function (acc1, scheduleId) {
        return __awaiter(this, void 0, void 0, function () {
            var signedTx, txResponse, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sdk_1.ScheduleSignTransaction()
                            .setScheduleId(scheduleId)
                            .freezeWith(this.client)
                            .sign(acc1.privateKey)];
                    case 1:
                        signedTx = _a.sent();
                        return [4 /*yield*/, signedTx.execute(this.client)];
                    case 2:
                        txResponse = _a.sent();
                        return [4 /*yield*/, txResponse.getReceipt(this.client)];
                    case 3:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt.status];
                }
            });
        });
    };
    HederaClient.prototype.deleteTransaction = function (acc, scheduleId) {
        return __awaiter(this, void 0, void 0, function () {
            var signedTx, txResponse, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sdk_1.ScheduleDeleteTransaction()
                            .setScheduleId(scheduleId)
                            .freezeWith(this.client)
                            .sign(acc.privateKey)];
                    case 1:
                        signedTx = _a.sent();
                        return [4 /*yield*/, signedTx.execute(this.client)];
                    case 2:
                        txResponse = _a.sent();
                        return [4 /*yield*/, txResponse.getReceipt(this.client)];
                    case 3:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt.status];
                }
            });
        });
    };
    HederaClient.prototype.deploySmartContract = function (acc, bytecode) {
        return __awaiter(this, void 0, void 0, function () {
            var fileCreateTx, submitTx, fileReceipt, bytecodeFileId, contractTx, signedTx, contractResponse, contractReceipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sdk_1.FileCreateTransaction()
                            //Set the bytecode of the contract
                            .setContents(bytecode)
                            .freezeWith(this.client)
                            .sign(acc.privateKey)
                        //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
                    ];
                    case 1:
                        fileCreateTx = _a.sent();
                        return [4 /*yield*/, fileCreateTx.execute(this.client)];
                    case 2:
                        submitTx = _a.sent();
                        return [4 /*yield*/, submitTx.getReceipt(this.client)];
                    case 3:
                        fileReceipt = _a.sent();
                        bytecodeFileId = fileReceipt.fileId;
                        // if error -> throw exception
                        //Log the file ID
                        console.log("The smart contract byte code file ID is " + bytecodeFileId);
                        contractTx = new sdk_1.ContractCreateTransaction()
                            //Set the file ID of the Hedera file storing the bytecode
                            .setBytecodeFileId(bytecodeFileId)
                            //Set the gas to instantiate the contract
                            .setGas(100000)
                            .setAdminKey(acc.publicKey)
                            .freezeWith(this.client);
                        return [4 /*yield*/, contractTx.sign(acc.privateKey)
                            //Submit the transaction to the Hedera test network
                        ];
                    case 4:
                        signedTx = _a.sent();
                        return [4 /*yield*/, signedTx.execute(this.client)];
                    case 5:
                        contractResponse = _a.sent();
                        return [4 /*yield*/, contractResponse.getReceipt(this.client)];
                    case 6:
                        contractReceipt = _a.sent();
                        //Get the smart contract ID
                        return [2 /*return*/, contractReceipt.contractId];
                }
            });
        });
    };
    HederaClient.prototype.executeSmartContractFunction = function (acc, contractId, func, params, payableAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var contractTransaction, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sdk_1.ContractExecuteTransaction()
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
                    ];
                    case 1:
                        contractTransaction = _a.sent();
                        return [4 /*yield*/, contractTransaction.execute(this.client)];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, res.getRecord(this.client)];
                    case 3: return [2 /*return*/, (_a.sent()).contractFunctionResult];
                }
            });
        });
    };
    HederaClient.prototype.deleteSmartContract = function (contractId, acc) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, signTx, txResponse, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transaction = new sdk_1.ContractDeleteTransaction()
                            .setContractId(contractId)
                            .setTransferAccountId(acc.accountId)
                            .freezeWith(this.client);
                        return [4 /*yield*/, transaction.sign(acc.privateKey)
                            //Sign the transaction with the client operator's private key and submit to a Hedera network
                        ];
                    case 1:
                        signTx = _a.sent();
                        return [4 /*yield*/, signTx.execute(this.client)];
                    case 2:
                        txResponse = _a.sent();
                        return [4 /*yield*/, txResponse.getReceipt(this.client)];
                    case 3:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt.status];
                }
            });
        });
    };
    return HederaClient;
}());
exports.HederaClient = HederaClient;
