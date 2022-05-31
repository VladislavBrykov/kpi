import * as awsService from './aws.service';

export const accessUser = async (token: string): Promise<boolean> => {
  return awsService.checkingUserAccess(token);
};

