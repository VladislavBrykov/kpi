import { ReportGroup } from '../models';
import { ReportGroupInput, ReportGroupOutput } from '../models/ReportGroup';

export const create = async (payload: ReportGroupInput): Promise<ReportGroupOutput> => {
    return await ReportGroup.create(payload);
}

export const update = async (id: string, payload: Partial<ReportGroupInput>): Promise<void> => {
    await ReportGroup.update(payload, { where: { id } });
}

export const getById = async (id: string): Promise<ReportGroupOutput | null> => {
    return  await ReportGroup.findOne({ where: { id } });
}

export const getByCampaignId = async (campaign_id: string): Promise<ReportGroupOutput[]> => {
    return await ReportGroup.findAll({
        where: {
            campaign_id
        }
    });
}