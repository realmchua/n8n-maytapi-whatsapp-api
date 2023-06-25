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

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();

    let credentials;
    let phoneNumber: string;
    let message: string;

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      let item: INodeExecutionData;

      try {
        credentials = await this.getCredentials('maytapiApi');
        if (!credentials || !credentials.apiKey) {
          throw new NodeOperationError(this.getNode(), 'Missing Maytapi API credentials!');
        }
        phoneNumber = this.getNodeParameter('phoneNumber', itemIndex) as string;
        message = this.getNodeParameter('message', itemIndex) as string;
      } catch (error) {
        throw new NodeOperationError(this.getNode(), 'Error occurred: ' + error);
      }

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
            'x-maytapi-key': credentials.apiKey as string,
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
          throw new NodeOperationError(this.getNode(), 'Error occurred: ' + error, {
            itemIndex,
          });
        }
      }
    }

    return this.prepareOutputData(items);
  }
}