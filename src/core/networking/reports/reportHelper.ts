export class ReportHelper
{
  public static displayPdf(blob: Blob)
  {
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  }

  public static async handleShareFile(blob: Blob, filename: string)
  {
    try
    {
      if (blob == undefined)
      {
        return;
      }

      const file = new File([blob], `${filename}.pdf`, { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] }))
      {
        await navigator.share({ files: [file] });
      }
      else
      {
        ReportHelper.displayPdf(blob);
      }
    }
    catch (error)
    {
      console.error("Error sharing file:", error);
    }
  }
}
