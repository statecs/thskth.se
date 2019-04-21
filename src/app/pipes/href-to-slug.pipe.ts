import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "hrefToSlug"
})
export class HrefToSlugPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let output = "";
    if (value.substring(0, 7) === "http://") {
      if (value.substring(8, 14) === "kths.se") {
        output = value.substring(14);
      } else if (value.substring(8, 16) === "thskth.se") {
        output = value.substring(16);
      } else if (value.substring(8, 20) === "dev.thskth.se") {
        output = value.substring(20);
      } else {
        output = value.substring(0);
      }
    } else if (value.substring(0, 8) === "https://") {
      if (value.substring(8, 15) === "kths.se") {
        output = value.substring(15);
      } else if (value.substring(8, 17) === "thskth.se") {
        output = value.substring(17);
      } else if (value.substring(8, 21) === "dev.thskth.se") {
        output = value.substring(21);
      } else {
        output = value.substring(0);
      }
    }
    return output;
  }
}
