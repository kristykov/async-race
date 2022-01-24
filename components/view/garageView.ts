import AbstractPageView from './abstractPageView';
import { IWinners } from '../interfaces/IWinners';
import { ICars } from '../interfaces/ICars';
import SettingsView from './settingsView';
import CarView from './carView';
import { ICar } from '../interfaces/ICar';
import Controller from '../controller/controller';

class GarageView extends AbstractPageView {
  settingsView: SettingsView;
  carView: CarView;
  controller: Controller;
  selectedId: number;
  currentPageNum: number;

  constructor(controller: Controller) {
    super();
    this.settingsView = new SettingsView();
    this.carView = new CarView();
    this.controller = controller;
    this.selectedId = 0;
    this.currentPageNum = 1;
  }

  async draw(data: IWinners | ICars) {
    this.settingsView.draw(this.pageContainer);

    if (data as ICars) {
      const carLen = (await this.controller.model.getAllCars()).length;

      await this.carView.draw(
        this.pageContainer,
        data as ICars,
        carLen,
        this.currentPageNum
      );
      const disabledPrev = this.currentPageNum === 1 ? 'disabled' : '';

      const nextPage = this.currentPageNum + 1;
      const disabledNext = nextPage * 7 <= carLen ? '' : 'disabled';

      this.pageContainer.innerHTML += ` <a class="blue-btn href-btn" id="prev-btn" ${disabledPrev} 
      >Prev</a
    >
    <a class="blue-btn href-btn" id="next-btn" ${disabledNext}
      >Next</a
    >`;
    }
    this.setEventListeners();
  }

  setEventListeners() {
    const settings = document.querySelector('.settings-section') as HTMLElement;
    if (settings) {
      settings.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        switch (target.id) {
          case 'create-btn':
            let [name, color] = [
              ...this.getCreateInputData('create-name-display', 'create-color'),
            ];
            if (name) {
              this.controller.createCar(name, color);
            } else {
              alert('Please, enter a car name to create a car section');
            }
            console.log(name, color);
            break;
          case 'update-btn':
            if (this.selectedId !== 0) {
              let [name, color] = [
                ...this.getCreateInputData(
                  'update-name-display',
                  'update-color'
                ),
              ];
              if (name) {
                this.controller.updateCar(name, color, this.selectedId);
              } else {
                alert('Please, enter a car name to update a car');
              }
            }
            console.log('update');
            break;
          case 'race-btn':
            this.controller.startRace();
            break;
          case 'reset-btn':
            this.controller.refreshPage();
            break;
          case 'generate-btn':
            this.controller.generateCars(this.selectedId);

            break;
        }
      });
    }

    const carsSection = document.querySelector('.road-bg') as HTMLElement;

    if (carsSection) {
      carsSection.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        switch (target.innerText) {
          case 'Select': {
            const parent = target.parentElement?.parentElement as HTMLElement;
            const car = parent.querySelector('.car-svg') as HTMLTemplateElement;

            if (!car) return;
            const id = parseInt(car.dataset.cid as string);
            this.selectedId = id;
            (document.getElementById(
              'update-name-display'
            ) as HTMLInputElement).value = car.dataset.cname as string;
            break;
          }
          case 'Remove': {
            const parent = target.parentElement?.parentElement as HTMLElement;
            const car = parent.querySelector('.car-svg') as HTMLTemplateElement;

            if (!car) return;
            const id = parseInt(car.dataset.cid as string);
            this.controller.removeCar(id);
          }
          case 'A': {
            const carId = target.dataset.engineStartId as string;
            this.controller.startDriving(carId);

            break;
          }
          case 'B': {
            const carId = target.dataset.engineStartId as string;
            this.controller.stopDriving(carId);
            console.log('stop engine');
            break;
          }
        }
      });
    }

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        if (this.currentPageNum > 1) {
          this.currentPageNum--;
          this.controller.refreshPage(this.currentPageNum.toString());
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', async (e) => {
        const carLen = (await this.controller.model.getAllCars()).length;
        const nextPage = this.currentPageNum + 1;
        if (nextPage * 7 <= carLen) {
          this.currentPageNum++;
          this.controller.refreshPage(this.currentPageNum.toString());
        }
      });
    }
  }

  getCreateInputData(nameInputId: string, colorInput: string) {
    return [
      (document.getElementById(nameInputId) as HTMLInputElement).value,
      (document.getElementById(colorInput) as HTMLInputElement).value,
    ];
  }
}

export default GarageView;
