import { Joi } from 'express-validation';

export const CreateReportValidation = {
    body: Joi.object({
        id: Joi.string().optional(),
        name: Joi.string(),
        category: Joi.array().items(Joi.string()),
        subcategories: Joi.array().items(Joi.string()),
        brand: Joi.array().items(Joi.string()),
        start_date: Joi.date(),
        end_date: Joi.date(),
        campaign_id: Joi.string(),
        keywords: Joi.array().items(Joi.object()),
        category_conversation: Joi.number(),
        brand_conversation: Joi.number(),
        brand_mentions: Joi.number(),
        brand_sov: Joi.object(),
        group_stats:Joi.object(),
        createdAt: Joi.date().optional(),
        updatedAt: Joi.date().optional(),
        share_of_voice: Joi.object().optional()
    })
}

export const UpdateReportValidation = {
    body: Joi.object({
        id: Joi.string().optional(),
        name: Joi.string().optional(),
        category: Joi.array().items(Joi.string()).optional(),
        subcategories: Joi.array().items(Joi.string()).optional(),
        brand: Joi.array().items(Joi.string()).optional(),
        start_date: Joi.date().optional(),
        end_date: Joi.date().optional(),
        campaign_id: Joi.string().optional(),
        keywords: Joi.array().items(Joi.object()).optional(),
        category_conversation: Joi.number().optional(),
        brand_conversation: Joi.number().optional(),
        brand_mentions: Joi.number().optional(),
        brand_sov: Joi.object().optional(),
        group_stats:Joi.object().optional(),
        createdAt: Joi.date().optional(),
        updatedAt: Joi.date().optional(),
        share_of_voice: Joi.object().optional()
    })
}

export const GenerateReportValidation = {
    body: Joi.object({
        campaignId: Joi.string(),
        categories: Joi.array().items(Joi.string()),
        subCategories: Joi.array().items(Joi.string()),
        brands: Joi.array().items(Joi.string()),
        startDateAtUTC: Joi.date(),
        endDateAtUTC: Joi.date(),
        filterKeywords: Joi.array().items(Joi.object()),
    })
}

export const DownloadReportExcelValidation = {
    body: Joi.object({
        brands: Joi.array().items(Joi.string()),
        startDateAtUTC: Joi.date(),
        endDateAtUTC: Joi.date(),
        filterKeywords: Joi.array().items(Joi.object()),
        categoryConversation: Joi.number(),
        brandConversation: Joi.number(),
        brandMentions: Joi.number(),
        shareOfVoice: Joi.object(),
        groupStats: Joi.object(),
        name: Joi.string().allow('').optional(),
        categories: Joi.array().items(Joi.string()),
        subCategories: Joi.array().items(Joi.string()),
    })
}