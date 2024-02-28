import { HttpClient, HttpParams } from '@angular/common/http';
import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-orderline',
  templateUrl: './orderline.component.html',
  styleUrl: './orderline.component.scss'
})
export class OrderlineComponent implements OnInit {
  
  arrOrderlineType: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]

  nSelectedType: number = 1;

  oData: minizubuAPI[] = [];

  displayedColumns: string[] = ['OrderLineID', 'OrderID', 'StockItemID', 'Description', 'PackageTypeID', 'Quantity', 'UnitPrice'];

  dataSource: MatTableDataSource<minizubuAPI> = new MatTableDataSource<minizubuAPI>([]);

  bShowTable: boolean = false;

  filterRanges: {from: number, to: number}[] = Array.from([{from: 0, to: 50 }, {from: 0, to: 50 }, {from: 51, to: 100 }, {from: 101, to: 150 }, {from: 151, to: 200 }]);

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
  
        this.oData = oData.sort((a, b) => a.OrderLineID - b.OrderLineID);
        this.dataSource = new MatTableDataSource<minizubuAPI>(this.oData);
        this.dataSource.paginator = this.paginator;

      }
    });
  }

  public applyFilter(rangeFrom: number): void {
    return;
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

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];







//   displayedColumns: string[] = ["OrderLineID", "OrderID", "StockItemID", "Description", "PackageTypeID", "Quantity", "UnitPrice"];
//   exampleDatabase: ExampleHttpDatabase | null;
//   data: minizubuAPI[] = [];

//   resultsLength = 0;
//   isLoadingResults = true;
//   isRateLimitReached = false;

//   @ViewChild(MatPaginator) paginator: MatPaginator;

//   @ViewChild(MatSort) sort: MatSort;

//   constructor(private _httpClient: HttpClient) {}

//   ngAfterViewInit() {
//     this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

//     // If the user changes the sort order, reset back to the first page.
//     this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

//     merge(this.sort.sortChange, this.paginator.page)
//       .pipe(
//         startWith({}),
//         switchMap(() => {
//           this.isLoadingResults = true;
//           return this.exampleDatabase!.getRepoIssues(
//             this.sort.active,
//             this.sort.direction,
//             this.paginator.pageIndex,
//           ).pipe(catchError(() => observableOf(null)));
//         }),
//         map(data => {
//           // Flip flag to show that loading has finished.
//           this.isLoadingResults = false;
//           this.isRateLimitReached = data === null;

//           if (data === null) {
//             return [];
//           }

//           // Only refresh the result length if there is new data. In case of rate
//           // limit errors, we do not want to reset the paginator to zero, as that
//           // would prevent users from re-triggering requests.
//           this.resultsLength = data.OrderLineID;
//           return data;
//         }),
//       )
//       .subscribe(data => {
//         console.log('fetched');
//       } )
//         // (this.data = data));
//   }
// }

// export interface minizubuAPI {
//   OrderLineID: number,
//   OrderID: number,
//   StockItemID: number,
//   Description: string,
//   PackageTypeID: number,
//   Quantity: number,
//   UnitPrice: number
// }

// export interface GithubIssue {
//   created_at: string;
//   number: string;
//   state: string;
//   title: string;
// }

// /** An example database that the data source uses to retrieve data for the table. */
// export class ExampleHttpDatabase {
//   constructor(private _httpClient: HttpClient) {}

//   getRepoIssues(sort: string, order: SortDirection, page: number): Observable<minizubuAPI> {
//     const href = 'https://minizuba-fn.azurewebsites.net/api/orderlines?type_id=1';
//     // const requestUrl = `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${
//     //   page + 1
//     // }`;

//     return this._httpClient.get<minizubuAPI>(href);
//   }
// }
