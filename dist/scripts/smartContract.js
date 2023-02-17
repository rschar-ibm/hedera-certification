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
require("dotenv").config();
var sdk_1 = require("@hashgraph/sdk");
var accounts_1 = require("../lib/accounts");
var client_1 = require("../lib/client");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var acc1, myaccount, client, esealCompiled, bytecode, res, contractCallQuery, contractResult, result, status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    acc1 = (0, accounts_1.getAccount)(1);
                    myaccount = (0, accounts_1.getMyAccount)();
                    client = new client_1.HederaClient(myaccount);
                    console.log("Loading Smart contract");
                    esealCompiled = require("../../solidity/artifacts/contracts/certificationC3.sol/CertificationC1.json");
                    bytecode = esealCompiled.bytecode;
                    console.log("Deploying Smart contract");
                    return [4 /*yield*/, client.deploySmartContract(acc1, bytecode)
                        //Log the smart contract ID
                    ];
                case 1:
                    res = _a.sent();
                    //Log the smart contract ID
                    console.log("The smart contract ID is " + res);
                    console.log("Executing function1 with parameters 5 and 6");
                    contractCallQuery = new sdk_1.ContractExecuteTransaction()
                        //Set the ID of the contract to query
                        .setContractId(res)
                        //Set the gas to execute the contract call
                        .setGas(100000)
                        //Set the contract function to call
                        .setFunction("function1", new sdk_1.ContractFunctionParameters().addUint16(5).addUint16(6))
                        //Set the query payment for the node returning the request
                        //This value must cover the cost of the request otherwise will fail
                        .setPayableAmount(new sdk_1.Hbar(10));
                    return [4 /*yield*/, client.executeSmartContractFunction(acc1, res, "function1", new sdk_1.ContractFunctionParameters().addUint16(5).addUint16(6), sdk_1.Hbar.from(10, sdk_1.HbarUnit.Hbar))];
                case 2:
                    contractResult = _a.sent();
                    if (contractResult == null) {
                        console.log("Something went wrong");
                    }
                    contractResult = contractResult;
                    result = contractResult.getUint32(0);
                    //Log the updated message to the console
                    console.log("Result of function1: " + result);
                    console.log("Deleting smartcontract with id: " + res);
                    return [4 /*yield*/, client.deleteSmartContract(res, acc1)];
                case 3:
                    status = _a.sent();
                    console.log("Deletion was: " + status.toString());
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
main();
