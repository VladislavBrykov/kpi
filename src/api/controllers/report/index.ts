import * as service from '../../services/report.service';
import {
  CreateReportDTO,
  DownloadReportDTO,
  GenerateReportDTO,
  UpdateReportDTO,
} from '../../dto/report.dto';
import { Report, ReportMetrics } from '../../interfaces';
import * as mapper from './mapper';

export const create = async (payload: CreateReportDTO): Promise<Report> => {
  return mapper.toReport(await service.create(payload));
};
export const update = async (
  id: string,
  payload: UpdateReportDTO
): Promise<Report> => {
  return mapper.toReport(await service.update(id, payload));
};
export const getById = async (id: string): Promise<Report> => {
  return mapper.toReport(await service.getById(id));
};
export const deleteById = async (id: string): Promise<Boolean> => {
  return await service.deleteById(id);
};
export const getAll = async (): Promise<Report[]> => {
  return (await service.getAll()).map(mapper.toReport);
};

export const getAllByCampaignId = async (
  campaignId: string
): Promise<Report[]> => {
  return (await service.getAllByCampaignId(campaignId)).map(mapper.toReport);
};

export const generate = async (
  payload: GenerateReportDTO
): Promise<ReportMetrics> => {
  return await service.generate(payload);
};

export const downloadExcel = async (
  payload: DownloadReportDTO
): Promise<any> => {
  return await service.downloadExcel(payload);
};
