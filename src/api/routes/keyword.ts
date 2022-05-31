import { Router, Request, Response} from 'express'
import * as keywordController from '../controllers/keyword'

const keywordRouter = Router()

keywordRouter.get('/', async (req: Request, res: Response) => {
    try {
        const results = await keywordController.getAll()
        return res.status(200).send(results)
    } catch (err) {
        return res.status(400).send(err)
    }
})

export default keywordRouter
