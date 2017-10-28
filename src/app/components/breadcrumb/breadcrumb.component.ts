import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params, PRIMARY_OUTLET } from '@angular/router';
import 'rxjs/add/operator/filter';

interface IBreadcrumb {
  label: string;
  params: Params;
  url: string;
}
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @ViewChild('breadcrumbs_container') breadcrumbs_container: ElementRef;
  public breadcrumbs: IBreadcrumb[];
  public containerWidth: number;

  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router) {
    this.breadcrumbs = [];
    // subscribe to the route
    this.activatedRoute.params.subscribe(() => {
      // set breadcrumbs
      const root: ActivatedRoute = this.activatedRoute.root;
      this.breadcrumbs = this.getBreadcrumbs(root);
    });
  }

  private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    // get the child routes
    const children: ActivatedRoute[] = route.children;

    // return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }
    let breadcrumb: IBreadcrumb;
    if (breadcrumbs.length === 0) {
      // add breadcrumb for home page
      breadcrumb = {
        label: 'Home',
        params: route.snapshot.queryParams,
        url: '',
      };
      breadcrumbs.push(breadcrumb);
    }

    // iterate over each children
    for (const child of children) {
      // verify primary route
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      for (const routeURL of child.snapshot.url){
        let label = routeURL.path.split('-').join(' ');
        label = this.capitalizeFirstLetter(label);
        // append route URL to URL
        url += `/${routeURL.path}`;
        // add breadcrumb
        breadcrumb = {
          label: label,
          params: child.snapshot.queryParams,
          url: url,
        };
        breadcrumbs.push(breadcrumb);
      }

      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  ngOnInit() {
    const self = this;
    const timer = setInterval(function () {
      const items = self.breadcrumbs_container.nativeElement.getElementsByClassName('list-item');
      if (items) {
        clearInterval(timer);
        let containerWidth = 0;
        for (let i = 0; i < items.length; i++) {
          console.log(items[i].clientWidth);
          containerWidth += items[i].clientWidth + 10;
          if (i === items.length - 1) {
            self.containerWidth = containerWidth;
          }
        }
      }
    }, 100);

  }

}
