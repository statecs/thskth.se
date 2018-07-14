import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataFetcherService} from '../utility/data-fetcher.service';
import { URLSearchParams } from '@angular/http';
import * as _ from 'lodash';

export abstract class BaseDataService<T extends BaseDataInterface> {
    private data: BehaviorSubject<BaseData<T>> = new BehaviorSubject(null);
    private fetched = false;
    private params: URLSearchParams = new URLSearchParams();

    constructor(protected dataFetcherService: DataFetcherService,
                protected endpoint: string) {
    }

    getData(params: URLSearchParams = null): Observable<BaseData<T>> {
        if (params) {
            this.params = params;
        }

        if (!this.fetched) {
            this.fetched = true;
            this.fetchData();
        }

        return this.data.filter(data => {
            return data != null;
        });
    }

    private fetchData() {
        this.dataFetcherService.get(this.endpoint, this.params).subscribe(
            (values) => {
                this.data.next(new BaseData(this.mapItems(values)));
            }
        );
    }

    private mapItems(objects: any[]): T[] {
        return _.map(objects, (obj) => this.mapItem(obj));
    }

    protected mapItem(obj: any): T {
        return obj;
    }
}

export class BaseData<T> {
    constructor(public data: T[]) { }
}

interface BaseDataInterface {
    id: number;
}
