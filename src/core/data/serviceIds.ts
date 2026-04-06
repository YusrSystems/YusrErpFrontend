export default class ServiceIds
{
  public unitId!: number;
  public pricingMethodId!: number;

  constructor(init?: Partial<ServiceIds>)
  {
    Object.assign(this, init);
  }
}
