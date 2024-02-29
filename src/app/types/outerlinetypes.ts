export type QuantityRangeFilter = {
    from: number,
    to: number
}
  
export interface minizubuAPI {
    OrderLineID: number,
    OrderID: number,
    StockItemID: number,
    Description: string,
    PackageTypeID: number,
    Quantity: number,
    UnitPrice: number
}
  
export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}