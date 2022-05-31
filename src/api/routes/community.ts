import { Router, Request, Response} from 'express'
import * as communityController from '../../api/controllers/community'

const communityRouter = Router()

communityRouter.get('/campaign/:campaignId', async (req: Request, res: Response) => {
    try {
        const campaignId = String(req.params.campaignId)
        const result = await communityController.getByCampaignId(campaignId)
        return res.status(200).send(result)
    } catch (err) {
        return res.status(400).send(err)
    }
})

communityRouter.get('/', async (req: Request, res: Response) => {
    try {
        const results = await communityController.getAll()
        return res.status(200).send(results)
    } catch (err) {
        return res.status(400).send(err)
    }
})
export default communityRouter
