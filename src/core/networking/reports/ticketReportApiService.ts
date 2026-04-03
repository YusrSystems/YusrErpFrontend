import type { RequestResult } from "@/app/core/data/requestResult";
import { ApiConstants, YusrApiHelper } from "@yusr_systems/core";
import { ReportHelper } from "./reportHelper";

export default class TicketReportApiService
{
  static async getReport(
    id: number,
    checkIn: boolean,
    viewAction: "display" | "share" = "display",
    filename: string = ""
  ): Promise<boolean>
  {
    const url = `${ApiConstants.baseUrl}/Reports/Ticket`;
    const requestBody = { ticketId: id, checkIn: checkIn };

    const blob = await YusrApiHelper.PostBlob(url, requestBody);

    if (blob == undefined)
    {
      return false;
    }

    if (viewAction === "display")
    {
      ReportHelper.displayPdf(blob);
    }
    if (viewAction === "share")
    {
      ReportHelper.handleShareFile(blob, filename);
    }

    return true;
  }

  static async addToStorage(accessKey: string, last4Digits: string): Promise<RequestResult<{ url: string; }>>
  {
    const url = `${ApiConstants.baseUrl}/Reports/Ticket/AddToStorage/${accessKey}/${last4Digits}`;
    return await YusrApiHelper.Post<{ url: string; }>(url, {});
  }

  static async getReportUrl(accessKey: string, last4Digits: string): Promise<RequestResult<{ url: string; }>>
  {
    const url = `${ApiConstants.baseUrl}/Reports/TicketUrl/${accessKey}/${last4Digits}`;
    return await YusrApiHelper.Get<{ url: string; }>(url);
  }

  static async sendByEmail(accessKey: string, last4Digits: string): Promise<RequestResult<any>>
  {
    const url = `${ApiConstants.baseUrl}/Reports/Ticket/SendByEmail/${accessKey}/${last4Digits}`;
    return await YusrApiHelper.Post<any>(url, {});
  }
}
