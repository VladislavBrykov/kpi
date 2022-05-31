import { Report } from '../../interfaces'
import { ReportOutput } from '../../../db/models/Report'

export const toReport = (report: ReportOutput): Report => {
    return {
        id: report.id,
        name: report.name,
        category: report.category,
        subcategories: report.subcategories,
        brand: report.brand,
        start_date: report.start_date,
        end_date: report.end_date,
        campaign_id: report.campaign_id,
        keywords: report.keywords,
        category_conversation: report.category_conversation,
        brand_conversation: report.brand_conversation,
        brand_mentions: report.brand_mentions,
        brand_sov: report.brand_sov,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        group_stats:report.group_stats
    }
}
