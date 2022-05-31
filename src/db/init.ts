import { Report, ReportGroup } from './models'
const isDev = process.env.NODE_ENV === 'development'

const dbInit = () => {
    Report.sync({ alter: isDev })
    ReportGroup.sync({ alter: isDev })
}
export default dbInit