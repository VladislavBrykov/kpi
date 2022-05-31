import {Report} from '../models';
import {ReportInput, ReportOutput} from '../models/Report';
import {ErrorException} from '../../exceptions/error.exception';
import {ErrorCode} from '../../exceptions/error.code';

export const create = async (payload: ReportInput): Promise<ReportOutput> => {
  return await Report.create(payload);
};

export const update = async (
  id: string,
  payload: Partial<ReportInput>
): Promise<ReportOutput> => {
  await Report.update(payload, { where: { id } });
  const updatedReport = await Report.findByPk(id);
  if (!updatedReport) {
    throw new ErrorException(ErrorCode.NotFound);
  }
  return updatedReport;
};

export const getById = async (id: string): Promise<ReportOutput> => {
  const report = await Report.findByPk(id);
  if (!report) {
    throw new ErrorException(ErrorCode.NotFound);
  }
  return report;
};

export const deleteById = async (id: string): Promise<boolean> => {
  const deletedReportCount = await Report.destroy({
    where: { id },
  });
  return !!deletedReportCount;
};

export const getAll = async (): Promise<ReportOutput[]> => {
  return Report.findAll();
};

export const getAllByCampaignId = async (
  CampaignId: string
): Promise<ReportOutput[]> => {
  return Report.findAll({ where: { campaign_id: CampaignId } });
};
