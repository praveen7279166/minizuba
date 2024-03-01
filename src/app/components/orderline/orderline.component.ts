import { HttpClient, HttpParams } from '@angular/common/http';
import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { QuantityRangeFilter, minizubuAPI } from '../../types/outerlinetypes';

@Component({
  selector: 'app-orderline',
  templateUrl: './orderline.component.html',
  styleUrl: './orderline.component.scss'
})
export class OrderlineComponent implements OnInit {
  
  arrOrderlineType: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]

  nSelectedType: number = 1;

  oData: minizubuAPI[] = [];

  myControl = new FormControl();

  private oFullData: minizubuAPI[] = [];

  bQtyFltrApplied: boolean = false;

  displayedColumns: string[] = ['OrderLineID', 'OrderID', 'StockItemID', 'Description', 'PackageTypeID', 'Quantity', 'UnitPrice'];

  dataSource: MatTableDataSource<minizubuAPI> = new MatTableDataSource<minizubuAPI>([]);

  bShowTable: boolean = false;

  filterRanges: QuantityRangeFilter[] = Array.from([{from: 0, to: 50 }, {from: 51, to: 100 }, {from: 101, to: 150 }, {from: 151, to: 200 }, {from: 201, to: 1000 }]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private http: HttpClient, private oCD: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fnFetchData();
  }

  private fnFetchData(): void {
    this.bShowTable = false;

    let params = new HttpParams().set('type_id', this.nSelectedType.toString());
    const href = 'https://minizuba-fn.azurewebsites.net/api/orderlines';

    this.http.get<minizubuAPI[]>(href, { params }).subscribe((oData: minizubuAPI[]) => {
      if(!!oData && oData.length > 1) {
        this.bShowTable = true;
        this.oCD.detectChanges();
  
        this.oFullData = oData;
        this.oData = oData.sort((a, b) => a.OrderLineID - b.OrderLineID);
        this.dataSource = new MatTableDataSource<minizubuAPI>(this.oData);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  public applyFilter(range: QuantityRangeFilter): void {
    this.oData = this.oFullData.filter((oItem: minizubuAPI) => {return oItem.Quantity >= range.from && oItem.Quantity <= range.to});
    this.oData = this.oData.sort((a, b) => a.OrderLineID - b.OrderLineID);
    this.dataSource = new MatTableDataSource<minizubuAPI>(this.oData);
    this.dataSource.paginator = this.paginator;
    this.bQtyFltrApplied = true;
  }

  applyFilterBySearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public fnClearFilters(): void {
    this.oData = this.oFullData.sort((a, b) => a.OrderLineID - b.OrderLineID);
    this.dataSource = new MatTableDataSource<minizubuAPI>(this.oData);
    this.dataSource.paginator = this.paginator;
    this.bQtyFltrApplied = false;
  }

  public fnOrderTypeBtnClick(nOrderType: number): void {
    this.nSelectedType = nOrderType;
    this.fnFetchData();
  }

  public fngetPageSizeOptions(): number[] {
    let arr = [5, 10, 15, 25, 50, 100, 250, 500, 2000];
    const nDatalength: number = this.oData.length;
    let temparr: number[] = [];
    for (let i = 0; i <= arr.length; i++) {
      if (arr[i] < nDatalength) {
        temparr.push(arr[i]);
      }
      else {
        temparr.push(nDatalength);
        return temparr;
      }
    }
    return temparr;
  }

}