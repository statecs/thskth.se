import { KTHS.SEPage } from './app.po';

describe('kths.se App', () => {
  let page: KTHS.SEPage;

  beforeEach(() => {
    page = new KTHS.SEPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
