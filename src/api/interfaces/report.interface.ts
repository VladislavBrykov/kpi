export interface Report {
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
    createdAt: Date
    updatedAt: Date
    group_stats:object
}

export interface ReportMetrics {
    category_conversation: number
    brand_conversation: number
    brand_mentions: number
    brand_sov: object
    group_stats:object
}

export interface ReportMetricsInput {
    campaignId: string
    categories: string[]
    subCategories: string[]
    brands: string[]
    startDateAtUTC: Date
    endDateAtUTC: Date
    filterKeywords: object[]
}
