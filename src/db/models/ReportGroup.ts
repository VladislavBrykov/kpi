import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config'

interface ReportGroupAttributes {
    id: string
    group_name: string
    privacy: string
    report_id: string[]
    member_count: number
    business_category: string
    fb_group_id: string
    group_installation_started_at_utc: Date | null
    top_ten_cities: string
    state: string
    location: string
    group_id: string
    metadata: object
    timezone_name: string | null
    default_task_date: Date | null
    assets_kpis: string | null
    currency: string
    campaign_asset_proposal_sent: boolean
    group_task_status: string
    admin_count: number
    icon_url: string
    community_admin_id: string
    campaign_id: string
    posts_engagement_rate_last_ninety_days: number
    total_keyword_mentions: number
    is_accepted_by_community_admin: boolean
    campaign_post_engagement_rate_last_ninety_days: number
    total_brand_mentions: number
    pricing: number
    total_hashtag_mentions: number
    createdAt?: Date
    updatedAt?: Date
}
export interface ReportGroupInput extends Optional<ReportGroupAttributes, 'id'> {}
export interface ReportGroupOutput extends Required<ReportGroupAttributes> {}

class ReportGroup extends Model<ReportGroupAttributes, ReportGroupInput> implements ReportGroupAttributes {
    public id!: string
    public group_name!: string
    public privacy!: string
    public report_id!: string[]
    public member_count!: number
    public business_category!: string
    public fb_group_id!: string
    public group_installation_started_at_utc!: Date | null
    public top_ten_cities!: string
    public state!: string
    public location!: string
    public group_id!: string
    public metadata!: object
    public timezone_name!: string | null
    public default_task_date!: Date | null
    public assets_kpis!: string | null
    public currency!: string
    public campaign_asset_proposal_sent!: boolean
    public group_task_status!: string
    public admin_count!: number
    public icon_url!: string
    public community_admin_id!: string
    public campaign_id!: string
    public posts_engagement_rate_last_ninety_days!: number
    public total_keyword_mentions!: number
    public is_accepted_by_community_admin!: boolean
    public campaign_post_engagement_rate_last_ninety_days!: number
    public total_brand_mentions!: number
    public pricing!: number
    public total_hashtag_mentions!: number

    // timestamps!
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

ReportGroup.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    group_name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    privacy: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    report_id: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
    },
    member_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    business_category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    fb_group_id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    group_installation_started_at_utc: {
        type: DataTypes.DATE,
        allowNull: true
    },
    top_ten_cities: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    group_id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    metadata: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    timezone_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    default_task_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    assets_kpis: {
        type: DataTypes.STRING,
        allowNull: true
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    campaign_asset_proposal_sent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    group_task_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    admin_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    icon_url: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        defaultValue: ''
    },
    community_admin_id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    campaign_id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    posts_engagement_rate_last_ninety_days: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    total_keyword_mentions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    is_accepted_by_community_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    campaign_post_engagement_rate_last_ninety_days: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    total_brand_mentions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    pricing: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    total_hashtag_mentions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true
})

export default ReportGroup