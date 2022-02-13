import { Angcli2Page } from './app.po';

describe('angcli2 App', function() {
  let page: Angcli2Page;

  beforeEach(() => {
    page = new Angcli2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
