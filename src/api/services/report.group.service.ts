import * as reportGroupDal from '../../db/dal/report.group';
import { ReportGroupInput, ReportGroupOutput } from '../../db/models/ReportGroup';
import * as dynamoDbService from './dynamo.db.service';

export const saveReportGroupByCampaignIdAndReportId = async (
  campaignId: string,
  reportId: string
): Promise<void> => {
  const params = dynamoDbService.createParamsByCampaignId(campaignId);
  const data = await dynamoDbService.connectToBdConvosightProductionCampaignGroups(params);
  const campaignGroups = data.Items;

  if (campaignGroups && campaignGroups.length > 0) {
    campaignGroups.map(async (campaignGroup: any) => {
      campaignGroup = dynamoDbService.converterUnmarshall(campaignGroup);
      const data: ReportGroupInput = {
        id: campaignGroup.id,
        group_name: campaignGroup.groupName,
        privacy: campaignGroup.privacy,
        member_count: campaignGroup.memberCount,
        business_category: campaignGroup.businessCategory,
        fb_group_id: campaignGroup.fbGroupId,
        group_installation_started_at_utc:
          campaignGroup.groupInstallationStartedAtUTC,
        report_id: [],
        top_ten_cities: campaignGroup.topTenCities,
        state: campaignGroup.state,
        location: campaignGroup.location,
        group_id: campaignGroup.groupId,
        metadata: campaignGroup.metadata,
        timezone_name: campaignGroup.timezoneName,
        default_task_date: campaignGroup.defaultTaskDate,
        assets_kpis: campaignGroup.assetsKpis,
        currency: campaignGroup.currency,
        campaign_asset_proposal_sent: campaignGroup.campaignAssetProposalSent,
        group_task_status: campaignGroup.groupTaskStatus,
        admin_count: campaignGroup.adminCount,
        icon_url: campaignGroup.iconUrl,
        community_admin_id: campaignGroup.communityAdminId,
        campaign_id: campaignId,
        posts_engagement_rate_last_ninety_days:
          campaignGroup.postsEngagementRateLastNinetyDays,
        total_keyword_mentions: campaignGroup.totalKeywordMentions,
        is_accepted_by_community_admin:
          campaignGroup.isAcceptedByCommunityAdmin,
        campaign_post_engagement_rate_last_ninety_days:
          campaignGroup.campaignPostEngagementRateLastNinetyDays,
        total_brand_mentions: campaignGroup.totalBrandMentions,
        pricing: campaignGroup.pricing,
        total_hashtag_mentions: campaignGroup.totalHashtagMentions,
      };

      let currentReportGroup = undefined;
      if (data.id) {
        currentReportGroup = await reportGroupDal.getById(data.id);
      }

      if (data.id && currentReportGroup) {
        data.report_id = currentReportGroup.report_id;
        if (!data.report_id.includes(reportId)) {
          let reportIds = data.report_id.toString();
          reportIds = reportIds.replace(/["{}]/g, '');
          data.report_id = reportIds.split(',');
          data.report_id.push(reportId);
        }

        await reportGroupDal.update(data.id, data);
      } else {
        data.report_id = [reportId];
        await reportGroupDal.create(data);
      }
    });
  }
};

export const getByCampaignId = async (
  campaignId: string
): Promise<ReportGroupOutput[]> => {
  return reportGroupDal.getByCampaignId(campaignId);
};
