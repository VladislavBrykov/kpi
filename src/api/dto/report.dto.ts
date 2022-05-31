import { Optional } from 'sequelize/types'

export type CreateReportDTO = {
    id: string
    name: string
    category: string[]
    subcategories: string[]
    brand: string[]
    start_date: Date
    end_date: Date
    campaign_id: string
    keywords: object[]
    category_conversation: number
    brand_conversation: number
    brand_mentions: number
    brand_sov: object
    group_stats:object
}

export type UpdateReportDTO = Optional<CreateReportDTO, 'name'>

export type GenerateReportDTO = {
    campaignId: string
    categories: string[]
    subCategories: string[]
    brands: string[]
    startDateAtUTC: Date
    endDateAtUTC: Date
    filterKeywords: object[]
}

export type DownloadReportDTO = {
    name: string
    categories: string[]
    subCategories: string[]
    brands: string[]
    startDateAtUTC: Date
    endDateAtUTC: Date
    filterKeywords: object[]
    categoryConversation: number
    brandConversation: number
    brandMentions: number
    shareOfVoice: object
    groupStats: object
}
