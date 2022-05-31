import * as service from '../../services/community.service'

export const getByCampaignId = async (campaignId: string): Promise<any> => {
    return await service.getByCampaignId(campaignId)
}

export const getAll = async(): Promise<any[]> => {
    return await service.getAll()
}
