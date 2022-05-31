import DynamoDB from "../../db/dynamo";
import AWS from "aws-sdk";

export const emptyItemList: AWS.DynamoDB.ItemList = [];

export const createParamsByCampaignId = (campaignId: string) => {
  return {
    TableName: "bd-convosight-production-campaignGroups",
    KeyConditionExpression: "#campaignId = :campaignId",
    ExpressionAttributeNames: {
      "#campaignId": "campaignId",
    },
    ExpressionAttributeValues: {
      ":campaignId": { S: campaignId },
    },
  };
};

export const createParamsByCategory = (category: string) => {
  return {
    TableName: "bd-convosight-production-keywords",
    IndexName: "category-index",
    KeyConditionExpression: "category = :category",
    ExpressionAttributeValues: {
      ":category": { S: category },
    },
  };
};

export const connectToBdConvosightProductionCampaignGroups = async (
  params: any
) => {
  return await DynamoDB.query(params).promise();
};

export const getUserParameters = async (cognitoId: string) => {
  const params = {
    Key: {
      cognitoId: { S: cognitoId },
    },
    TableName: process.env.AWS_COGNITO_CONVOSIGHT_TABLE_USERS!,
  };
  return await DynamoDB.getItem(params).promise();
};

export const scanOperation = async (scanParams: any) => {
  return new Promise((resolve, reject) => {
    DynamoDB.scan(scanParams, function (err, responseData) {
      if (err) {
        reject(err);
      } else {
        resolve(responseData);
      }
    });
  });
};

export const converterUnmarshall = (campaignGroup: any) => {
  return AWS.DynamoDB.Converter.unmarshall(campaignGroup);
}
