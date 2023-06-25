import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MaytapiCredentialsApi implements ICredentialType {
  name = 'maytapiApi';
  displayName = 'Maytapi Credentials API';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
  ];
}
