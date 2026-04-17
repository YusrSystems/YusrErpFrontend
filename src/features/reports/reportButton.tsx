import { Button } from "@yusr_systems/ui";
import { Loader2, Printer, Share2 } from "lucide-react";
import { useState } from "react";
import type { BaseReportRequest } from "../../core/data/report/baseReportRequest";
import ReportApiService from "../../core/networking/reportApiService";

export type ReportButtonProps = {
  reportName: string;
  request: BaseReportRequest;
};

export default function ReportButton({ reportName, request }: ReportButtonProps)
{
  const service = new ReportApiService();

  const [isPrinting, setIsPrinting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  return (
    <div>
      <Button
        className="rounded-l-none!"
        variant="secondary"
        disabled={ isPrinting || isSharing }
        onClick={ async () =>
        {
          setIsSharing(true);
          await service.Get(reportName, "share", request, "report");
          setIsSharing(false);
        } }
      >
        { isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4 " /> }
      </Button>
      <Button
        className="rounded-r-none!"
        disabled={ isPrinting || isSharing }
        onClick={ async () =>
        {
          setIsPrinting(true);
          await service.Get(reportName, "display", request, "report");
          setIsPrinting(false);
        } }
      >
        { isPrinting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4 " /> }
      </Button>
    </div>
  );
}
