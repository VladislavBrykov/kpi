export interface CognitoIdentityParams {
  AuthFlow: string,
  ClientId: string,
  AuthParameters: {
    'USERNAME': string,
    'PASSWORD': string,
  },
}
