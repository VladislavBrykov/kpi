import excel from 'exceljs';
import * as reportDal from '../../db/dal/report';
import * as reportGroupService from './report.group.service';
import { ReportInput, ReportOutput } from '../../db/models/Report';
import { ReportMetricsInput } from '../interfaces';
import { DownloadReportDTO } from '../dto/report.dto';
import KnexClient from '../../db/knex';
import * as dynamoDbService from './dynamo.db.service';

export const create = async (payload: ReportInput): Promise<ReportOutput> => {
  const report = await reportDal.create(payload);
  await reportGroupService.saveReportGroupByCampaignIdAndReportId(
    report.campaign_id,
    report.id
  );

  return report;
};
export const update = async (
  id: string,
  payload: Partial<ReportInput>
): Promise<ReportOutput> => {
  const report = await reportDal.update(id, payload);
  await reportGroupService.saveReportGroupByCampaignIdAndReportId(
    report.campaign_id,
    report.id
  );

  return report;
};
export const getById = (id: string): Promise<ReportOutput> => {
  return reportDal.getById(id);
};
export const deleteById = (id: string): Promise<boolean> => {
  return reportDal.deleteById(id);
};

export const getAllByCampaignId = (
  campaignId: string
): Promise<ReportOutput[]> => {
  return reportDal.getAllByCampaignId(campaignId);
};

export const getAll = (): Promise<ReportOutput[]> => {
  return reportDal.getAll();
};
type GroupStats = {
  categoryConversation: number;
  brandConversation: number;
  brandSOV: number;
  brandMentions: number;
  groupId: string;
};

const getSelectionKeywords = (keywords: any[], isBrands = false) => {
  const or = [];
  for (const keyword of keywords) {
    keyword.includeInSelection = isBrands || !keyword.mainSubset || keyword.mainSubset === 'Main';

    const transformations =
      keyword.transformations && keyword.includeInSelection
        ? keyword.transformations.split(',')
        : [];

    for (let transformation of transformations) {
      transformation = transformation.replace(/'/g, '\'\'');
      transformation = transformation.replace(/_/g, ' ');
      transformation = transformation.toLowerCase();
      (transformation) ? or.push('\'%' + transformation + '%\'') : null;
    }
  }
  return (or.length) ? '(textlower ilike ' + or.join(' or textlower ilike' + ' ') + ')' : null;
};
const getConversations = async (
  startDateUtc: Date,
  endDateUtc: Date,
  orSelection: string,
  groupsList: string,
  table: string
) => {
  try {
    const conversationQuery = `select id, groupid, textlower as rawTextLower from ${table} where recordedatdate >= '${startDateUtc}' and createdatutc >= '${startDateUtc}' and createdatutc < '${endDateUtc}' and groupid in (${groupsList}) and ((${orSelection} ) or (parentsourceid in (select sourceid from ${table} where recordedatdate >= '${startDateUtc}' and createdatutc >= '${startDateUtc}' and createdatutc < '${endDateUtc}' and groupid in (${groupsList}) and ${orSelection} and type = 'Post' and grouptype = 'Facebook')))`;
    const results = await KnexClient.raw(conversationQuery);

    return (results['rows']) ? results['rows'] : [];
  } catch (err) {
    console.log(err);
  }
};

const getConversationCount = async (startDateUtc: Date, endDateUtc: Date, orSelection: string, groupsList: string, table: string) => {
  const conversationQuery = `SELECT COUNT(*) FROM((SELECT id, textlower as rawTextLower, type, sourceid, EXTRACT(month from createdatutc) as createdatutcmonth,date_part(w, createdatutc) as createdatutcweek,EXTRACT(day from createdatutc) as createdatutcday,EXTRACT(hour from createdatutc) as createdatutchour,EXTRACT(year from createdatutc) as createdatutcyear, createdatutc,grouptype,recordedatutc FROM ${table} WHERE parentsourceid IN ( SELECT sourceid FROM ${table} WHERE createdatutc >=CAST('${startDateUtc}' as timestamp) and createdatutc < CAST('${endDateUtc}' as timestamp) AND (${orSelection}) AND type ='Post' and grouptype='Facebook' AND groupid IN (${groupsList})) AND createdatutc >=CAST('${startDateUtc}'  as timestamp) and createdatutc < CAST('${endDateUtc}' as timestamp) and groupid In (${groupsList})) UNION ( SELECT id, textlower as rawTextLower, type,sourceid, EXTRACT(month from createdatutc) as createdatutcmonth,date_part(w, createdatutc) as createdatutcweek,EXTRACT(day from createdatutc) as createdatutcday,EXTRACT(hour from createdatutc) as createdatutchour,EXTRACT(year from createdatutc) as createdatutcyear, createdatutc,grouptype,recordedatutc FROM ${table} WHERE createdatutc >= CAST('${startDateUtc}' as timestamp) and createdatutc < CAST('${endDateUtc}' as timestamp) AND (${orSelection}) AND type <> 'Post' AND groupid IN (${groupsList}) ) UNION ( SELECT id, textlower as rawTextLower, type, sourceid,  EXTRACT(month from createdatutc) as createdatutcmonth,date_part(w, createdatutc) as createdatutcweek,EXTRACT(day from createdatutc) as createdatutcday,EXTRACT(hour from createdatutc) as createdatutchour,EXTRACT(year from createdatutc) as createdatutcyear, createdatutc,grouptype,recordedatutc FROM ${table} WHERE createdatutc >= CAST( '${startDateUtc}' AS timestamp ) AND createdatutc <= CAST('${endDateUtc}' AS timestamp ) AND ( ${orSelection} ) AND type = 'Post' AND groupid IN (${groupsList})))`
  const results = await KnexClient.raw(conversationQuery)
  return (results['rows']) ? results['rows'][0]['count'] : 0;
};

const getBrandTransformations = (keywords: any[], brandName: string) => {
  let transformations;
  for (let keyword of keywords) {
    if (keyword.uiFriendlyName == brandName) {
      transformations = keyword.transformations;
      break;
    }
  }
  return transformations;
};

const getMentionCount = (
  textlowercase: string,
  keywordTransformations: string,
  count = 0
) => {
  if (textlowercase) {
    let transformations = (keywordTransformations) ? keywordTransformations.split(',') : [];
    for (let transformation of transformations) {
      // transformation = transformation.replace(/'/g, '\'\'');
      transformation = transformation.replace(/_/g, ' ');
      transformation = transformation.replace(/%/g,'.+');
      let regex = new RegExp(transformation,'i');
      if (regex.test(textlowercase)) {
        count += 1;
        break;
      }
    }
  }
  return count;
};

export const generate = async (payload: ReportMetricsInput): Promise<any> => {
  console.log('Generating report');
  return new Promise(async (resolve, reject) => {
    try {
      const campaignParams = dynamoDbService.createParamsByCampaignId(payload.campaignId);
      const campaignGroupsData = await dynamoDbService.connectToBdConvosightProductionCampaignGroups(campaignParams);
      const campaignGroups = campaignGroupsData.Items || [];
      console.log(
        'Got campaignGroups, number of items are:',
        campaignGroups.length
      );

      const campaignGroupIds = [];
      const groupIdToGroupName: { [key: string]: string } = {};
      for (const group of campaignGroups) {
        const campaignGroupData = dynamoDbService.converterUnmarshall(group);
        campaignGroupIds.push('\'' + campaignGroupData.groupId + '\'');
        groupIdToGroupName[campaignGroupData.groupId] = campaignGroupData.groupName
      }
      const campaignGroupsList = campaignGroupIds.join(',');
      console.log(groupIdToGroupName);
      let categoryKeywords = dynamoDbService.emptyItemList;
      for (const category of payload.categories) {
        const params = dynamoDbService.createParamsByCategory(category);
        const data = await dynamoDbService.connectToBdConvosightProductionCampaignGroups(params);
        if (data.Items) {
          const unmarshallData = data.Items.map(item => dynamoDbService.converterUnmarshall(item));
          // @ts-ignore
          categoryKeywords = [...categoryKeywords, ...unmarshallData];
        }
      }
      const categoryKeywordsSelection =
        getSelectionKeywords(categoryKeywords) || '';
      const categoryConversationPromise = getConversations(
        payload.startDateAtUTC,
        payload.endDateAtUTC,
        categoryKeywordsSelection,
        campaignGroupsList,
        'bd_cs_prod_conversations'
      );

      const brandKeywords = categoryKeywords.filter(keyword => keyword.keywordCategory === 'Brands' && payload.brands.includes(keyword.uiFriendlyName as string));

      const brandKeywordsSelection = getSelectionKeywords(brandKeywords, true) || '';
      const brandConversationPromise = getConversations(
        payload.startDateAtUTC,
        payload.endDateAtUTC,
        brandKeywordsSelection,
        campaignGroupsList,
        'bd_cs_prod_conversations'
      );

      let categoryConversation = await categoryConversationPromise;
      categoryConversation = categoryConversation ? categoryConversation : [];

      if (payload.filterKeywords.length) {
        categoryConversation = categoryConversation.filter((row: any) => {
          for (const filterKeyword of payload.filterKeywords) {
            const keywordValue = Object.values(filterKeyword)[0];
            const keywordsList = keywordValue.split(',');
            for (const keyword of keywordsList) {
              if (row['rawtextlower'] && row['rawtextlower'].toLowerCase().includes(keyword)) {
                return true;
              }
            }
          }

          return false;
        });
      }

      console.log('got data');
      const group_stats: { [key: string]: Partial<GroupStats> } = {};
      for (let row of categoryConversation) {
        let groupName = groupIdToGroupName[row['groupid']];
        if (group_stats[groupName]) {
          // @ts-ignore
          group_stats[groupName].categoryConversation = group_stats[groupName].categoryConversation + 1
        } else {
          group_stats[groupName] = {
            categoryConversation: 1,
            groupId: row['groupid'],
            brandConversation: 0,
            brandMentions: 0
          };
        }
      }

      let brandConversation = await brandConversationPromise;
      brandConversation = brandConversation ? brandConversation : [];

      if (payload.filterKeywords.length) {
        brandConversation = brandConversation.filter((row: any) => {
          for (const filterKeyword of payload.filterKeywords) {
            const keywordValue = Object.values(filterKeyword)[0];
            const keywordsList = keywordValue.split(',');
            for (const keyword of keywordsList) {
              if (row['rawtextlower'] && row['rawtextlower'].toLowerCase().includes(keyword)) {
                return true;
              }
            }
          }

          return false;
        });
      }

      for (let row of brandConversation) {
        let groupName = groupIdToGroupName[row['groupid']];
        if (group_stats[groupName]) {
          // @ts-ignore
          group_stats[groupName].brandConversation = group_stats[groupName].brandConversation + 1
        } else {
          group_stats[groupName].brandConversation = 1;
        }
      }
      console.log(group_stats);
      const sovResult: any = {};
      const sovBrandsList: string[] = [];
      for (const keyword of categoryKeywords) {
        if (payload.subCategories.includes(keyword.subCategory as string) && keyword.keywordCategory === 'Brands') {
          if (!sovBrandsList.includes(keyword.uiFriendlyName as string)) {
            sovBrandsList.push(keyword.uiFriendlyName as string);
          }
        }
      }

      for (const brand of sovBrandsList) {
        const brandTransformations = getBrandTransformations(
          categoryKeywords,
          brand
        );
        let sovBrandMentions = 0;
        let previousResult=sovBrandMentions
        for (const row of categoryConversation) {
          sovBrandMentions = getMentionCount(
            row['rawtextlower'],
            brandTransformations,
            sovBrandMentions
          );

          let groupName = groupIdToGroupName[row['groupid']];
          group_stats[groupName].brandSOV = sovBrandMentions;
          // @ts-ignore
          if(payload.brands.includes(brand)&&(sovBrandMentions-previousResult)>0){
            if (group_stats[groupName]) {
              // @ts-ignore
              group_stats[groupName].brandMentions = group_stats[groupName].brandMentions + 1
            } else {
              group_stats[groupName].brandMentions = 1;
            }
          }
          previousResult = sovBrandMentions
        }
        sovResult[brand] = sovBrandMentions;
      }

      let brandMentions = 0;
      for (const brand of payload.brands) {
        brandMentions += sovResult[brand] || 0;
      }

      resolve({
        category_conversation: categoryConversation.length,
        brand_conversation: brandConversation.length,
        brand_mentions: brandMentions,
        share_of_voice: sovResult,
        group_stats: group_stats,
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const downloadExcel = async (
  payload: DownloadReportDTO
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const workbook = new excel.Workbook();
      const kpiWorksheet = workbook.addWorksheet('KPI Details');
      const communityWorksheet = workbook.addWorksheet('Community List');
      kpiWorksheet.columns = [
        { header: 'KPI', key: 'kpi' },
        { header: 'Value', key: 'value' },
        { header: '', key: 'value' },
      ];

      kpiWorksheet.addRow(['Category', ...payload.categories]);
      kpiWorksheet.addRow(['Sub-Category', ...payload.subCategories]);
      kpiWorksheet.addRow(['Brand', ...payload.brands]);
      kpiWorksheet.addRow(['Start Date', payload.startDateAtUTC]);
      kpiWorksheet.addRow(['End Date', payload.endDateAtUTC]);
      kpiWorksheet.addRow(['Filter by Keywords', ...payload.filterKeywords]);
      kpiWorksheet.addRow([
        'Category Conversations',
        payload.categoryConversation,
      ]);
      kpiWorksheet.addRow(['Brand Conversations', payload.brandConversation]);
      kpiWorksheet.addRow(['Brand Mentions', payload.brandMentions]);

      let totalSOV = 0;
      Object.values(payload.shareOfVoice).forEach((sov) => {
        totalSOV += parseInt(sov, 10);
      });

      for (const [brand, value] of Object.entries(payload.shareOfVoice)) {
        kpiWorksheet.addRow([
          `${brand} Mention`,
          value,
          totalSOV === 0 || parseInt(value, 10) === 0
            ? '0%'
            : `${((parseInt(value, 10) * 100) / totalSOV).toFixed(2)}%`,
        ]);
      }

      kpiWorksheet.columns.forEach((column) => (column.width = 25));
      kpiWorksheet.getRow(1).font = { bold: true };
      console.log('KpiWorksheet column count',kpiWorksheet.actualColumnCount);
      console.log('KpiWorksheet row count',kpiWorksheet.actualRowCount);
      communityWorksheet.columns = [
        { header: 'Serial Number', key: 'serial_number' },
        { header: 'FB Group Name', key: 'fb_group_name' },
        { header: 'Category Conversations', key: 'category_conversations' },
        { header: 'Brand Conversations', key: 'brand_conversations' },
        { header: 'Campaign Brand SoV', key: 'campaign_brand_sov' },
        { header: 'Brand Mentions', key: 'brand_mentions' }
      ];

      let totalCampaignSOV = 0;
      Object.values(payload.groupStats).forEach((groupStat) => {
        totalCampaignSOV += groupStat.brandSOV;
      });

      let serialNumber = 0;
      for (const [groupName, value] of Object.entries(payload.groupStats)) {
        serialNumber++;
        communityWorksheet.addRow([
          serialNumber,
          groupName,
          value.categoryConversation,
          value.brandConversation,
          totalCampaignSOV === 0 || value.brandSOV === 0
            ? '0%'
            : `${((value.brandSOV * 100) / totalCampaignSOV).toFixed(2)}%`,
          value.brandMentions
        ]);
      }
      communityWorksheet.columns.forEach((column) => (column.width = 25));
      communityWorksheet.getRow(1).font = { bold: true };
      console.log('communityWorksheet column count',communityWorksheet.actualColumnCount);
      console.log('communityWorksheet row count',communityWorksheet.actualRowCount);
      const buffer = await workbook.xlsx.writeBuffer();
      resolve(buffer);
    } catch (err) {
      reject(err);
    }
  });
};
