import AbstractPageView from './abstractPageView';
import { IWinners } from '../interfaces/IWinners';
import { ICars } from '../interfaces/ICars';
import Controller from '../controller/controller';
import { IWinner } from '../interfaces/IWinner';
import { ICar } from '../interfaces/ICar';

class WinnersView extends AbstractPageView {
  controller: Controller;
  lastTimeOrder: string = 'ASC';
  lastWinsOrder: string = 'ASC';
  lastNameOrder: string = 'ASC';

  constructor(controller: Controller) {
    super();
    this.controller = controller;
  }

  async draw(data: IWinners | ICars) {
    this.pageContainer.innerHTML = '';
    this.pageContainer.innerHTML = `<h2>Winners <span>(${
      data.length
    })</span></h2><h3>Page #1</h3><table class="winners-list"><thead><tr><th>Number</th><th>Car</th><th id="sort-id" data-order='${
      this.lastNameOrder
    }'>Name</th><th id="sort-wins" data-order='${
      this.lastWinsOrder
    }'>Wins</th><th id="sort-time" data-order='${
      this.lastTimeOrder
    }'>Best time (seconds)</th></tr></thead>
    <tbody>
    ${await this.drawWinners(data as IWinners)}

    </tbody>
    </table>`;
    this.initListeners();
  }

  async drawWinners(winners: IWinners) {
    const rows = winners.map((winner: IWinner, i: number) => {
      const car = {
        ...this.controller.model.carsData?.find((car) => car.id === winner.id),
      } as ICar;
      return car
        ? `<tr><td>${
            i + 1
          }</td><td class="fix-car">${this.controller.view.garageView.carView.renderCar(
            car.id,
            car.name,
            car.color
          )}</td><td>${car.name}</td> <td>${winner.wins}</td> <td>${
            winner.time
          }</td></tr>`
        : '';
    });
    return rows.join('');
  }

  initListeners() {
    const sortTimeBtn = document.getElementById('sort-time') as HTMLElement;
    if (sortTimeBtn) {
      sortTimeBtn.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        console.log(target);

        console.log(target.dataset.order);
        let order = target.dataset.order == 'ASC' ? 'DESC' : 'ASC';
        this.lastTimeOrder = order;
        console.log('order', order);

        // swap arrow direction
        const { items, count } = await this.controller.model.getWinners({
          page: '1',
          limit: 10,
          sort: 'time',
          order: order,
        });
        this.draw(items);
      });
    }

    const sortWinsBtn = document.getElementById('sort-wins') as HTMLElement;
    if (sortWinsBtn) {
      sortWinsBtn.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;

        let order = target.dataset.order == 'ASC' ? 'DESC' : 'ASC';
        this.lastWinsOrder = order;

        // swap arrow direction
        const { items, count } = await this.controller.model.getWinners({
          page: '1',
          limit: 10,
          sort: 'wins',
          order: order,
        });
        this.draw(items);
      });
    }

    const sortNameBtn = document.getElementById('sort-id') as HTMLElement;
    if (sortNameBtn) {
      sortNameBtn.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        console.log(target);

        console.log(target.dataset.order);
        let order = target.dataset.order == 'ASC' ? 'DESC' : 'ASC';
        this.lastNameOrder = order;
        console.log('order', order);

        // swap arrow direction
        const { items, count } = await this.controller.model.getWinners({
          page: '1',
          limit: 10,
          sort: 'id',
          order: order,
        });
        this.draw(items);
      });
    }
  }
}

export default WinnersView;
