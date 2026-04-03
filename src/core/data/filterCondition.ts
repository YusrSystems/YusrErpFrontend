export class FilterCondition
{
  value!: string;
  columnName!: string;

  constructor(init?: Partial<FilterCondition>)
  {
    Object.assign(this, init);
  }
}
