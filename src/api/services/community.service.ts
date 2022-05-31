import * as dynamoDbService from "./dynamo.db.service";

const performAsyncScanOperation = (scanParams: any) => {
  return dynamoDbService.scanOperation(scanParams);
};

export const getByCampaignId = async (campaignId: string): Promise<any> => {
  const params = dynamoDbService.createParamsByCampaignId(campaignId);
  try {
    let data =
      await dynamoDbService.connectToBdConvosightProductionCampaignGroups(
        params
      );
    return data.Items;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getAll = async (): Promise<any[]> => {
  let allItems: any[] = [];
  let LastEvaluatedKeyFlag = true;
  let scanParams: any = {
    TableName: "bd-convosight-production-campaignGroups",
  };
  while (LastEvaluatedKeyFlag) {
    let responseData: any = await performAsyncScanOperation(scanParams);
    let batchItems = responseData.Items;
    allItems = allItems.concat(batchItems);
    if (responseData.LastEvaluatedKey) {
      LastEvaluatedKeyFlag = true;
      console.log("LastEvaluatedKey", responseData.LastEvaluatedKey);
      scanParams.ExclusiveStartKey = responseData.LastEvaluatedKey;
    } else {
      LastEvaluatedKeyFlag = false;
    }
  }
  return allItems;
};

