import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config'

interface ReportAttributes {
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
    createdAt?: Date
    updatedAt?: Date
    group_stats:object
}
export interface ReportInput extends Optional<ReportAttributes, 'id'> {}
export interface ReportOutput extends Required<ReportAttributes> {}

class Report extends Model<ReportAttributes, ReportInput> implements ReportAttributes {
    public id!: string
    public name!: string
    public category!: string[]
    public subcategories!: string[]
    public brand!: string[]
    public start_date!: Date
    public end_date!: Date
    public campaign_id!: string
    public keywords!: object[]
    public category_conversation!: number
    public brand_conversation!: number
    public brand_mentions!: number
    public brand_sov!: object
    public group_stats!:object

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Report.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    subcategories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    brand: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    campaign_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    keywords: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false
    },
    category_conversation: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    brand_conversation: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    brand_mentions: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    brand_sov: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    group_stats: {
        type: DataTypes.JSONB,
        allowNull: false
    },
}, {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true
})

export default Report
