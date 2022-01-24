import { ICar } from '../interfaces/ICar';
import { ICars } from '../interfaces/ICars';

abstract class AbstractComponentView {
  constructor() {}
  abstract draw(
    container: HTMLTemplateElement,
    data: ICars,
    carLen?: number,
    currentPage?: number
  ): void;
}

export default AbstractComponentView;
