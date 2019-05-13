export interface IRestriction {
  id: number;
  title: string;
  content: string;
  active: boolean;
}

export class Restriction implements IRestriction {
  id: number;
  title: string;
  content: string;
  active: boolean;

  static convertToRestrictionType(res) {
    const restriction: Restriction[] = [];

    res.forEach(d => {
      restriction.push({
        id: d.id,
        title: d.title.rendered,
        content: d.content.rendered,
        active: d.acf.active
      });
    });
    return restriction;
  }
}
