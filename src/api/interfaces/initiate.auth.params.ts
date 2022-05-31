export interface InitiateAuthParams {
  ClientId: string,
  AuthFlow: string,
  AuthParameters: {
    'REFRESH_TOKEN': string,
  }
}
