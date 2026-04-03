import { ApiConstants, YusrApiHelper } from "@yusr_systems/core";
import { ReportHelper } from "./reportHelper";

export default class DepositReportApiService
{
  static async getReport(id: number, userId: number, viewAction: "display" | "share" = "display", filename: string = "")
  {
    const url = `${ApiConstants.baseUrl}/Reports/Deposit`;
    const requestBody = { depositId: id, userId: userId };

    const blob = await YusrApiHelper.PostBlob(url, requestBody);

    if (blob == undefined)
    {
      return;
    }

    if (viewAction === "display")
    {
      ReportHelper.displayPdf(blob);
    }
    if (viewAction === "share")
    {
      ReportHelper.handleShareFile(blob, filename);
    }
  }
}
