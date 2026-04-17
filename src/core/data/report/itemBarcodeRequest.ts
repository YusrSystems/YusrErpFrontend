import type { BaseReportRequest } from "./baseReportRequest";

export class ItemBarcodeRequest implements BaseReportRequest
{
  barcode: string;
  companyName: string;
  itemName: string;
  iupmName: string;
  price: number;
  barcodesQtn: number;
  currency: string;

  constructor(init?: Partial<ItemBarcodeRequest>)
  {
    this.barcode = "";
    this.companyName = "";
    this.itemName = "";
    this.iupmName = "";
    this.price = 0;
    this.barcodesQtn = 0;
    this.currency = "";
    Object.assign(this, init);
  }
}
