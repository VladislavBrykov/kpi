import * as dynamoDbService from "./dynamo.db.service";

const performAsyncScanOperation = (scanParams: any) => {
  return dynamoDbService.scanOperation(scanParams);
};

export const getAll = async (): Promise<any> => {
  let allItems: any[] = [];
  let LastEvaluatedKeyFlag = true;
  let scanParams: any = {
    TableName: 'bd-convosight-production-keywords',
  };
  while (LastEvaluatedKeyFlag) {
    let responseData: any = await performAsyncScanOperation(scanParams);
    let batchItems = responseData.Items;
    allItems = allItems.concat(batchItems);
    if (responseData.LastEvaluatedKey) {
      LastEvaluatedKeyFlag = true;
      scanParams.ExclusiveStartKey = responseData.LastEvaluatedKey;
    } else {
      LastEvaluatedKeyFlag = false;
    }
  }

  return allItems;
};
