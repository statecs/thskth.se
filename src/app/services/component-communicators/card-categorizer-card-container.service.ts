import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CardCategorizerCardContainerService {
  private notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();

  constructor() { }

  updateCards(arg: Object) {
    this.notify.next(arg);
  }
}
