import AWS from 'aws-sdk';
import { CognitoIdentityParams } from '../interfaces/cognito.identity.params';
import { AuthenticationResultType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { AwsParams } from '../interfaces/aws.params';
import { ErrorException } from '../../exceptions/error.exception';
import { ErrorCode } from '../../exceptions/error.code';
const Verifier = require('verify-cognito-token');
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
import * as dynamoDbService from './dynamo.db.service';
import { RolesUser } from '../constants/roles';
import { InitiateAuthParams } from '../interfaces/initiate.auth.params';
import { AuthFlow } from '../constants/auth.flow';

export const searchUserByEmailPassword = async (
  email: string,
  password: string
): Promise<AuthenticationResultType | undefined> => {
  const config = {
    apiVersion: process.env.AWS_COGNITO_API_VERSION,
    region: process.env.AWS_COGNITO_REGION,
  };
  const cognitoIdentity = new AWS.CognitoIdentityServiceProvider(config);
  const clientId: string = process.env.AWS_COGNITO_CLIENT_ID!;
  const cognitoIdentityParams: CognitoIdentityParams = {
    AuthFlow: process.env.AWS_COGNITO_TYPE_AUTH!,
    ClientId: clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };
  try {
    const data = await cognitoIdentity
      .initiateAuth(cognitoIdentityParams)
      .promise();
    if (data) {
      return data.AuthenticationResult;
    } else {
      throw new ErrorException(ErrorCode.NotFound);
    }
  }
  catch (err) {
    throw new ErrorException(ErrorCode.NotFound);
  }
};

export const accessTokenVerify = async (token: string): Promise<boolean> => {
  const params: AwsParams = {
    region: process.env.AWS_COGNITO_REGION!,
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
  };
  const verifier = new Verifier(params);
  return new Promise((resolve) => {
    verifier.verify(token).then((result: boolean) => {
      resolve(result);
    });
  });
};

export const checkingUserAccess = async (token: string): Promise<boolean> => {
  const cognitoIdentityToken = {
    AccessToken: token,
  };
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.getUser(
      cognitoIdentityToken,
      async function (err, data) {
        if (data && data!.UserAttributes[0]!.Value!) {
          const cognitoId: string = data.UserAttributes[0].Value;
          const result = await dynamoDbService.getUserParameters(cognitoId);
          if (
            result.Item!.userType.S &&
            result.Item!.userType.S === RolesUser.admin
          ) {
            resolve(true);
          } else {
            resolve(false);
          }
        } resolve(false);
      }
    );
  });
};

export const initiateAuth = async (token: string): Promise<string | boolean> => {
  const params: InitiateAuthParams = {
    ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
    AuthFlow: AuthFlow.refreshToken,
    AuthParameters: {
      'REFRESH_TOKEN': token,
    }
  }
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.initiateAuth(params, async function (err, data) {
      if (data && data.AuthenticationResult && data.AuthenticationResult.AccessToken) {
        const accessToken: string = data.AuthenticationResult.AccessToken!;
        resolve(data.AuthenticationResult.AccessToken);
      } else resolve(false);
    });
  });
};

export const logout = async (token: string): Promise<string | boolean> => {
  const params = {
    'AccessToken': token,
  }
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.globalSignOut(params, async function (err, data) {
      if (data) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};
