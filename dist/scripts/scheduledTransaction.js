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
var client_1 = require("../lib/client");
var accounts_1 = require("../lib/accounts");
var sdk_1 = require("@hashgraph/sdk");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var acc1, acc2, myaccount, client, balance, res, info, status, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    acc1 = (0, accounts_1.getAccount)(1);
                    acc2 = (0, accounts_1.getAccount)(2);
                    myaccount = (0, accounts_1.getMyAccount)();
                    client = new client_1.HederaClient(myaccount);
                    return [4 /*yield*/, client.getBalance(acc1)];
                case 1:
                    balance = _a.sent();
                    console.log(balance.hbars.toString());
                    return [4 /*yield*/, client.scheduleTransaction(myaccount, acc1, acc2, sdk_1.Hbar.from(2, sdk_1.HbarUnit.Hbar), "my memo19")];
                case 2:
                    res = _a.sent();
                    console.log("Scheduled Transaction with scheduleId: " + res.scheduleId + " and transactionId: " + res.transactionId + "\n");
                    return [4 /*yield*/, client.getBalance(acc1)];
                case 3:
                    balance = _a.sent();
                    console.log(balance.hbars.toString());
                    return [4 /*yield*/, client.retrieveScheduldedTransactionInformation(res.scheduleId)];
                case 4:
                    info = _a.sent();
                    console.log("Scheduled Transaction %s has %sbeen executed", info.scheduleMemo, info.executed == null ? "not " : "");
                    return [4 /*yield*/, client.deleteTransaction(acc1, res.scheduleId)];
                case 5:
                    status = _a.sent();
                    console.log("Deleted Transaction with scheduleId: " + res.scheduleId + "with status: " + status.toString());
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, client.signScheduledTransaction(acc1, res.scheduleId)];
                case 7:
                    status = _a.sent();
                    console.log("Executed transaction for scheduleId: " + res.scheduleId);
                    return [3 /*break*/, 9];
                case 8:
                    e_1 = _a.sent();
                    console.log("Could not execute transaction for scheduleId " + res.scheduleId + ". Error: " + e_1.status.toString());
                    return [3 /*break*/, 9];
                case 9:
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
main();
