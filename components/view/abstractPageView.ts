import { IWinners } from '../interfaces/IWinners';
import { ICars } from '../interfaces/ICars';

abstract class AbstractPageView {
  pageContainer: HTMLTemplateElement;

  constructor() {
    this.pageContainer = document.getElementById(
      'page-container'
    ) as HTMLTemplateElement;
  }
  abstract draw(data: ICars | IWinners): void;
}

export default AbstractPageView;
