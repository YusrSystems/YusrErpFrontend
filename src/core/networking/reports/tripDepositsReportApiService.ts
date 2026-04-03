import { ApiConstants, YusrApiHelper } from "@yusr_systems/core";
import { ReportHelper } from "./reportHelper";

export default class TripDepositsReportApiService
{
  static async getReport(
    id: number,
    commission: number,
    showAmount: boolean,
    userId: number,
    viewAction: "display" | "share" = "display",
    filename: string = ""
  )
  {
    const url = `${ApiConstants.baseUrl}/Reports/TripDeposits`;
    const requestBody = { tripId: id, commission: commission, showAmount: showAmount, userId: userId };

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
