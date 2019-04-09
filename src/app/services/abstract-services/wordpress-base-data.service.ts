import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DataFetcherService } from "../utility/data-fetcher.service";
import { URLSearchParams } from "@angular/http";
import * as _ from "lodash";
import { SearchParams } from "../../interfaces-and-classes/archive";

export abstract class WordpressBaseDataService<T extends BaseDataInterface> {
  private data: BehaviorSubject<T[]> = new BehaviorSubject(null);
  private fetched = false;
  private params: string;

  constructor(
    protected dataFetcherService: DataFetcherService,
    protected endpoint: string = ""
  ) {}

  getData(
    endpointExtension: string = "",
    params: string = ""
  ): Observable<T[]> {
    if (params) {
      this.params = params;
    }
    if (endpointExtension && this.endpoint !== "") {
      this.endpoint +=
        endpointExtension[0] === "/"
          ? endpointExtension
          : "/" + endpointExtension;
    } else if (this.endpoint === "") {
      this.endpoint = endpointExtension;
    }

    return this.dataFetcherService.get(this.endpoint + "?" + params);
  }

  private fetchData(url: string): Observable<T[]> {
    return this.dataFetcherService.get(url);
  }

  getDataByURL(query: string = "", url: string = null): Observable<T[]> {
    return this.dataFetcherService.get(
      (url ? url : this.endpoint) + "?" + query
    );
  }

  getDataById(query: string = "", url: string = null): Observable<T[]> {
    return this.dataFetcherService.get(
      (url ? url : this.endpoint) + "?" + query
    );
  }

  getDataBySlug(query: string = "", url: string = null): Observable<T[]> {
    return this.fetchData((url ? url : this.endpoint) + "?" + query);
  }

  searchData(query: string = "", url: string = null) {
    return this.fetchData((url ? url : this.endpoint) + "?" + query);
  }

  private mapItems(objects: any[]): T[] {
    return _.map(objects, obj => this.mapItem(obj));
  }

  protected mapItem(obj: any): T {
    return obj;
  }
}

export interface BaseDataInterface {
  id: number;
}
