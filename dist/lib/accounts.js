"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAccount = exports.getAccount = exports.addAccount = void 0;
var sdk_1 = require("@hashgraph/sdk");
var fs = require('fs');
var _a = require('envfile'), parse = _a.parse, stringify = _a.stringify;
function addAccount(num, account) {
    var _a;
    var file = fs.readFileSync('./.env');
    var parsedFile = parse(file);
    parsedFile["PRIVATE_KEY_".concat(num)] = account.privateKey.toStringDer();
    parsedFile["PUBLIC_KEY_".concat(num)] = (_a = account.publicKey) === null || _a === void 0 ? void 0 : _a.toStringDer();
    parsedFile["ACCOUNT_ID_".concat(num)] = account.accountId.toString();
    fs.writeFileSync('./.env', stringify(parsedFile));
}
exports.addAccount = addAccount;
function getAccount(num) {
    var file = fs.readFileSync('./.env');
    var parsedFile = parse(file);
    return {
        privateKey: sdk_1.PrivateKey.fromString(parsedFile["PRIVATE_KEY_".concat(num)]),
        publicKey: sdk_1.PublicKey.fromString(parsedFile["PUBLIC_KEY_".concat(num)]),
        accountId: sdk_1.AccountId.fromString(parsedFile["ACCOUNT_ID_".concat(num)])
    };
}
exports.getAccount = getAccount;
function getMyAccount() {
    var file = fs.readFileSync('./.env');
    var parsedFile = parse(file);
    return {
        privateKey: sdk_1.PrivateKey.fromString(parsedFile["MY_PRIVATE_KEY"]),
        publicKey: sdk_1.PublicKey.fromString(parsedFile["MY_PUBLIC_KEY"]),
        accountId: sdk_1.AccountId.fromString(parsedFile["MY_ACCOUNT_ID"])
    };
}
exports.getMyAccount = getMyAccount;
