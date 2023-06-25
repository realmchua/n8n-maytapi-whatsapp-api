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
exports.MaytapiWhatsAppNode = void 0;
var n8n_workflow_1 = require("n8n-workflow");
var http = require("http");
var MaytapiWhatsAppNode = /** @class */ (function () {
    function MaytapiWhatsAppNode() {
        this.description = {
            displayName: 'Maytapi WhatsApp',
            name: 'maytapiWhatsApp',
            group: ['transform'],
            version: 1,
            description: 'Maytapi WhatsApp Node',
            defaults: {
                name: 'Maytapi WhatsApp',
            },
            icon: 'https://maytapi.com/images/maytapi.svg',
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'maytapiApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Phone Number',
                    name: 'phoneNumber',
                    type: 'string',
                    default: '',
                    required: true,
                },
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    default: '',
                    required: true,
                },
            ],
        };
    }
    MaytapiWhatsAppNode.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, credentials, phoneNumber, message, _loop_1, this_1, itemIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = this.getInputData();
                        _loop_1 = function (itemIndex) {
                            var item, error_1, requestData_1, requestOptions_1, response, error_2;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        item = void 0;
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, this_1.getCredentials('maytapiApi')];
                                    case 2:
                                        credentials = _b.sent();
                                        if (!credentials || !credentials.apiKey) {
                                            throw new n8n_workflow_1.NodeOperationError(this_1.getNode(), 'Missing Maytapi API credentials!');
                                        }
                                        phoneNumber = this_1.getNodeParameter('phoneNumber', itemIndex);
                                        message = this_1.getNodeParameter('message', itemIndex);
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_1 = _b.sent();
                                        throw new n8n_workflow_1.NodeOperationError(this_1.getNode(), 'Error occurred: ' + error_1);
                                    case 4:
                                        _b.trys.push([4, 6, , 7]);
                                        item = items[itemIndex];
                                        requestData_1 = JSON.stringify({
                                            phone: phoneNumber,
                                            message: message,
                                        });
                                        requestOptions_1 = {
                                            hostname: 'api.maytapi.com',
                                            port: 80,
                                            path: '/api/sendMessage',
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'x-maytapi-key': credentials.apiKey,
                                            },
                                        };
                                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                var req = http.request(requestOptions_1, function (res) {
                                                    var responseBody = '';
                                                    res.on('data', function (chunk) {
                                                        responseBody += chunk;
                                                    });
                                                    res.on('end', function () {
                                                        resolve(responseBody);
                                                    });
                                                });
                                                req.on('error', function (error) {
                                                    reject(error);
                                                });
                                                req.write(requestData_1);
                                                req.end();
                                            })];
                                    case 5:
                                        response = _b.sent();
                                        item.json['response'] = JSON.parse(response);
                                        return [3 /*break*/, 7];
                                    case 6:
                                        error_2 = _b.sent();
                                        if (this_1.continueOnFail()) {
                                            items.push({
                                                json: this_1.getInputData(itemIndex)[0].json,
                                                error: error_2,
                                                pairedItem: itemIndex,
                                            });
                                        }
                                        else {
                                            if (error_2.context) {
                                                error_2.context.itemIndex = itemIndex;
                                                throw error_2;
                                            }
                                            throw new n8n_workflow_1.NodeOperationError(this_1.getNode(), 'Error occurred: ' + error_2, {
                                                itemIndex: itemIndex,
                                            });
                                        }
                                        return [3 /*break*/, 7];
                                    case 7: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        itemIndex = 0;
                        _a.label = 1;
                    case 1:
                        if (!(itemIndex < items.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(itemIndex)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        itemIndex++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, this.prepareOutputData(items)];
                }
            });
        });
    };
    return MaytapiWhatsAppNode;
}());
exports.MaytapiWhatsAppNode = MaytapiWhatsAppNode;
