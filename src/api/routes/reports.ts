import { Router, Request, Response, NextFunction } from 'express';
import { validate } from 'express-validation';
import * as reportController from '../../api/controllers/report';
import {
  CreateReportDTO,
  UpdateReportDTO,
  GenerateReportDTO,
  DownloadReportDTO,
} from '../dto/report.dto';
import {
  DownloadReportExcelValidation,
  GenerateReportValidation,
  UpdateReportValidation,
} from '../validation/report.validation';

const reportsRouter = Router();

reportsRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await reportController.getById(id);
      return res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }
);
reportsRouter.put(
  '/:id',
  validate(UpdateReportValidation, {}, { abortEarly: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const payload: UpdateReportDTO = req.body;

      const result = await reportController.update(id, payload);
      return res.status(201).send(result);
    } catch (err) {
      next(err);
    }
  }
);
reportsRouter.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await reportController.deleteById(id);
      return res.status(204).send({
        success: result,
      });
    } catch (err) {
      next(err);
    }
  }
);
reportsRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: CreateReportDTO = req.body;
      const result = await reportController.create(payload);
      return res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }
);
reportsRouter.get(
  '/campaign/:campaignId',
  async (req: Request<{ campaignId: string}>, res: Response, next: NextFunction) => {
    try {
      const { campaignId } = req.params;
      const results = await reportController.getAllByCampaignId(campaignId);
      return res.status(200).send(results);
    } catch (err) {
      next(err);
    }
  }
);

reportsRouter.post(
  '/generate',
  validate(GenerateReportValidation, {}, { abortEarly: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: GenerateReportDTO = req.body;
      const result = await reportController.generate(payload);
      return res.status(200).send(result);
    } catch (err) {
      return res.status(400).send(err);
    }
  }
);

reportsRouter.post(
  '/download/excel',
  validate(DownloadReportExcelValidation, {}, { abortEarly: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: DownloadReportDTO = req.body;
      const buffer = await reportController.downloadExcel(payload);
      res.status(200).send(buffer);
    } catch (err) {
      next(err);
    }
  }
);

export default reportsRouter;
