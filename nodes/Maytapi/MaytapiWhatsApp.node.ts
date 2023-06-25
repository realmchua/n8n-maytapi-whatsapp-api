import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

import http from 'http';

export class MaytapiWhatsAppNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Maytapi WhatsApp',
    name: 'maytapiWhatsApp',
    group: ['transform'],
    version: 1,
    description: 'Maytapi WhatsApp Node',
    defaults: {
      name: 'Maytapi WhatsApp',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'API Key',
        name: 'apiKey',
        type: 'string',
        default: '',
        required: true,
      },
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

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();

    let item: INodeExecutionData;
    let apiKey: string;
    let phoneNumber: string;
    let message: string;

    try {
      apiKey = this.getNodeParameter('apiKey') as string;
      phoneNumber = this.getNodeParameter('phoneNumber') as string;
      message = this.getNodeParameter('message') as string;
    } catch (error) {
      throw new NodeOperationError(this.getNode(), error);
    }

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      try {
        item = items[itemIndex];

        const requestData = JSON.stringify({
          phone: phoneNumber,
          message: message,
        });

        const requestOptions = {
          hostname: 'api.maytapi.com',
          port: 80,
          path: '/api/sendMessage',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-maytapi-key': apiKey,
          },
        };

        const response = await new Promise<string>((resolve, reject) => {
          const req = http.request(requestOptions, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => {
              responseBody += chunk;
            });
            res.on('end', () => {
              resolve(responseBody);
            });
          });

          req.on('error', (error) => {
            reject(error);
          });

          req.write(requestData);
          req.end();
        });

        item.json['response'] = JSON.parse(response);
      } catch (error) {
        if (this.continueOnFail()) {
          items.push({
            json: this.getInputData(itemIndex)[0].json,
            error,
            pairedItem: itemIndex,
          });
        } else {
          if (error.context) {
            error.context.itemIndex = itemIndex;
            throw error;
          }
          throw new NodeOperationError(this.getNode(), error, {
            itemIndex,
          });
        }
      }
    }

    return this.prepareOutputData(items);
  }
}