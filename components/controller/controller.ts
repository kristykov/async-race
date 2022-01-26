import Model from '../model/model';
import AppView from '../view/appView';
import AbstractPageView from '../view/abstractPageView';
import { ICars } from '../interfaces/ICars';
import { ICar } from '../interfaces/ICar';
import { IWinners } from '../interfaces/IWinners';

class Controller {
  model: Model;
  view: AppView;
  animations: { [carId: string]: { id: number | null } } = {};

  constructor() {
    this.model = new Model();
    this.view = new AppView(this);
    this.init();
  }

  async init() {
    let cars: ICars;
    cars = await this.model.getCars('1');

    this.view.drawGarageView(cars);
    location.hash = 'garage';
    window.addEventListener('hashchange', async () => {
      this.refreshPage();
    });
    console.log(
      'При нажатии на Race или кнопку A для одной машины, подождите, пожалуйста, ответа сервера'
    );
  }

  async refreshPage(page = '1') {
    let data: ICars | IWinners;
    const base = location.hash.includes('?')
      ? location.hash.split('?')[0]
      : location.hash;

    if (base.slice(1) === 'garage') {
      this.view.garageView.currentPageNum = parseInt(page);
      // (1) get garage data
      data = await this.model.getCars(page);

      // (2) give data to view
      this.view.currentView = this.view.garageView;
      //
    } else if (base.slice(1) === 'winners') {
      // (1) get winners data
      const { items, count } = await this.model.getWinners({
        page: '1',
        limit: 10,
        sort: 'time',
        order: 'ASC',
      });
      data = items;

      // (2) give data to view
      this.view.currentView = this.view.winnersView;
    } else {
      return;
    }
    this.view.currentView.draw(data);
  }

  async createCar(name: string, color: string) {
    const data = {
      name: name,
      color: color,
      id: ++this.model.idCounter,
    };

    await this.model.createCar(data);
    this.refreshPage();
  }

  async updateCar(name: string, color: string, id: number) {
    const data = {
      name: name,
      color: color,
      id: id,
    };

    await this.model.updateCar(id.toString(), data);
    this.refreshPage();
  }

  async removeCar(id: number) {
    await this.model.deleteCar(id.toString());
    await this.model.deleteWinner(id.toString());
    this.refreshPage();
  }

  generateCars(id: number) {
    const carBrands = [
      'Ferrari',
      'Porsche',
      'Honda',
      'Toyota',
      'Audi',
      'Jeep',
      'Chrysler',
      'Mazda',
      'Jaguar',
      'Ford Mustang',
    ];
    const carModels = [
      'Model A',
      'Model B',
      'Model C',
      'Model S',
      'Model E',
      'Model F',
      'Model G',
      'Model U',
      'Model X',
      'Model Z',
    ];
    const carColors = [
      '#34568B',
      '#FF6F61',
      '#6B5B95',
      '#88B04B',
      '#F7CAC9',
      '#92A8D1',
      '#009B77',
      '#DD4124',
      '#363945',
      '#EFE1CE',
    ];

    const generateRandomCars = (count = 100) =>
      [...Array(count).keys()].map((n) => {
        const randomBrand =
          carBrands[Math.floor(Math.random() * carBrands.length)];
        const randomModel =
          carModels[Math.floor(Math.random() * carModels.length)];
        const randomColor =
          carColors[Math.floor(Math.random() * carColors.length)];

        const data = {
          name: `${randomBrand} ${randomModel}`,
          color: randomColor,
          id: this.model.idCounter + n + 1,
        };
        this.model.createCar(data);
      });
    generateRandomCars();
    this.model.idCounter = this.model.idCounter + 100;
    this.refreshPage();
  }

  async stopDriving(carId: string) {
    const stopBtn = document.querySelector(
      `button[data-engine-stop-id="${carId}"]`
    ) as HTMLButtonElement;
    stopBtn.disabled = true;

    await this.model.stopEngine(carId);
    const car = document.querySelector(
      `.car-svg[data-cid="${carId}"]`
    ) as HTMLElement;

    if (this.animations[carId]) {
      const anim = this.animations[carId];
      if (anim.id) {
        window.cancelAnimationFrame(anim.id);
      }
    }
  }

  async startDriving(carId: string, context?: this) {
    if (!context) {
      context = this;
    }
    const startBtn = document.querySelector(
      `button[data-engine-start-id="${carId}"]`
    ) as HTMLButtonElement;
    if (!startBtn) return { success: false, carId, time: 0 };
    startBtn.disabled = true;

    // enable stop btn
    (startBtn.nextElementSibling as HTMLButtonElement).disabled = false;

    const { velocity, distance } = await context.model.startEngine(carId);
    const time = Math.round(distance / velocity);

    const car = document.querySelector(
      `.car-svg[data-cid="${carId}"]`
    ) as HTMLElement;

    const { success } = await context.model.drive(carId);

    if (success) {
      const flag = document.querySelector('.finish-line') as HTMLElement;
      const htmlDist = Math.floor(context.getDistElem(car, flag));

      context.animations[carId] = context.animation(car, htmlDist, time);
    }
    return { success, carId, time };
  }

  animation(car: HTMLElement, distance: any, animationTime: number) {
    // distance is html distance from car to flag/finish-line

    let start: number | null = null;
    const state: { id: number | null } = { id: null };

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const time = timestamp - start;
      const passed = Math.min(
        Math.round(time * (distance / animationTime)),
        distance
      );

      const percent = passed / distance;

      const leftPercent = 90 * percent;
      car.style.left = `${leftPercent}%`;

      // calculate percent of left
      // set left position

      if (passed < distance) {
        state.id = window.requestAnimationFrame(step);
      }
    }

    // call first time
    state.id = window.requestAnimationFrame(step);

    return state;
  }
  getPosition(el: HTMLElement) {
    const { left } = el.getBoundingClientRect();
    return {
      x: left,
    };
  }

  getDistElem(a: HTMLElement, b: HTMLElement) {
    const aPos = this.getPosition(a);
    const bPos = this.getPosition(b);

    return Math.sqrt(Math.pow(aPos.x - bPos.x, 2));
  }

  async race1(
    startDriving: (
      carId: string,
      context: this
    ) => Promise<{ success: any; carId: string; time: number }>
  ) {
    const promises = this.model.carsData?.map(({ id }) => {
      return startDriving(id.toString(), this);
    });

    const winner = await this.raceAll1(
      promises,
      this.model.carsData?.map((car) => car.id)
    );
    return winner;
  }

  async raceAll1(
    promises:
      | Promise<{ success: any; carId: string; time: number }>[]
      | undefined,
    carIds: number[] | undefined
  ): Promise<
    // | { time: number }
    { time: number; name: string; color: string; id: number } | undefined
  > {
    if (!promises) return undefined;
    const { success, carId, time } = await Promise.race(promises);

    if (!success && carIds && promises) {
      const failedIndex = carIds.findIndex((i) => i === +carId);
      const restPromises = [
        ...promises.slice(0, failedIndex),
        ...promises.slice(failedIndex + 1, promises.length),
      ];
      const restIds = [
        ...carIds.slice(0, failedIndex),
        ...carIds.slice(failedIndex + 1, carIds.length),
      ];
      return this.raceAll1(restPromises, restIds);
    }

    return {
      ...(this.model.carsData?.find((car) => car.id === +carId) ||
        ({ name: 'A', id: -1, color: '#fff' } as ICar)),
      time: +(time / 1000).toFixed(2),
    };
  }

  async raceAll(carIds: number[] | undefined) {
    if (!carIds) return;

    const results = [];

    for (let i = 0; i < carIds.length; i++) {
      const carId = carIds[i];
      const result = await this.startDriving(carId.toString());

      if (result.success) {
        results.push(result);
      }
    }
  }

  async startRace() {
    // set raceBtn to disabled = true
    const winner = await this.race1(this.startDriving);

    if (!winner) return;
    await this.model.saveWinner(winner);
    const message = document.getElementById('winner-message');
    if (message) {
      message.innerHTML = `${winner.name} went first ${winner.time}s`;
      message.style.opacity = '1';
    }
    // set resetBtn to disabled = false
  }
}

export default Controller;
