import AbstractComponentView from './abstractComponentView';
import { ICars } from '../interfaces/ICars';

class CarView extends AbstractComponentView {
  //   data: ICars | IWinners | undefined;
  constructor() {
    super();
  }

  async draw(
    container: HTMLTemplateElement,
    data: ICars,
    carLen: number,
    currentPage: number
  ) {
    const garageSection = document.createElement('section');
    garageSection.classList.add('garage-section');
    const h2 = document.createElement('h2');
    h2.innerHTML = `Garage (${carLen})`;
    garageSection.appendChild(h2);

    const h3 = document.createElement('h3');
    h3.innerHTML = `Page #${currentPage}`;
    h3.setAttribute('id', 'page-num');
    garageSection.appendChild(h3);

    const carsContainer = document.createElement('div');
    carsContainer.classList.add('road-bg');
    const messageP = document.createElement('p');
    messageP.setAttribute('id', 'winner-message');
    messageP.style.opacity = '0';
    carsContainer.appendChild(messageP);
    const finishLine = document.createElement('div');
    finishLine.classList.add('finish-line', 'checkered');
    carsContainer.appendChild(finishLine);

    data.forEach((car) => {
      const carSection = document.createElement('div');
      carSection.classList.add('car-section');
      carSection.innerHTML = `<div class="car-options-select">
        <button class="blue-btn select-btn">Select</button>
        <button class="blue-btn select-btn">Remove</button>
        <p class="car-name">${car.name}</p>
    </div>
    <div class="car-options-select">
        <button class="move-btn play-btn" data-engine-start-id=${
          car.id
        }>A</button>
        <button class="move-btn stop-btn" data-engine-stop-id=${
          car.id
        } disabled>B</button>
    </div>${this.renderCar(car.id, car.name, car.color)}`;
      carsContainer.appendChild(carSection);
    });
    garageSection.appendChild(carsContainer);
    container.appendChild(garageSection);
  }

  renderCar(id: number, name: string, color: string) {
    return `<svg class="car-svg" data-cid="${id}" data-cname="${name}" style="left: 0%" width="115.05" height="50" version="1.1" viewBox="0 0 30.44 13.229" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(8.6053 -8.6054)">
     <path class="body-color" d="m21.835 15.22c0-2.5285-0.36072-4.8634-3.4082-6.0325h-22.533c-4.5261 0.33275-4.4988 3.0134-4.4988 6.0325s-0.02735 5.6997 4.4988 6.0325h22.533c3.0474-1.1691 3.4082-3.5039 3.4082-6.0325z" fill="${color}" opacity=".996"/>
     <path d="m13.668 15.22c0-1.3359-0.20227-2.9666-1.0933-4.7097l-4.5403 0.91741c0.46362 0.93791 0.51336 2.8097 0.51229 3.7923 0.0011 0.98256-0.04867 2.8545-0.51229 3.7924l4.5403 0.91741c0.891-1.743 1.0933-3.3739 1.0933-4.7098z" fill="#444"/>
     <path d="m21.583 15.22s-0.01513-1.6311-0.1354-1.9328c-0.12027-0.30167-0.49299-0.52347-0.49299-0.52347 0.09908 0.85107 0.10502 1.8351 0.10344 2.4563 0.0016 0.62121-0.0044 1.6053-0.10344 2.4564 0 0 0.37272-0.22181 0.49299-0.52347 0.12027-0.30167 0.1354-1.9329 0.1354-1.9329z" fill="#313131"/>
     <path d="m11.795 20.22-4.3332-0.8277c-2.1222-0.04343-4.202-0.1187-6.5729 0.02435l-2.1423 0.6086c4.2125 0.31607 8.7236 0.27937 13.048 0.19475z" fill="#444"/>
     <path d="m-0.38747 11.474c-1.4827-0.21965-3.4359-0.2778-4.2173-0.12048-0.78141 0.15731-0.94683 2.5378-0.94683 3.8661 0 1.3284 0.16542 3.709 0.94683 3.8663 0.78141 0.15731 2.7346 0.09916 4.2173-0.12048-0.29844-1.1553-0.44759-2.4575-0.44759-3.7458s0.14915-2.5904 0.44759-3.7457z" fill="#444"/>
     <path d="m21.423 17.812-0.57206 0.31384c-0.33767 0.67174-0.95405 1.4683-1.7346 2.251 0.21326-0.0081 0.38054 0.02757 0.68855-0.14632 0.30802-0.17389 1.2085-1.1294 1.6181-2.4185z" fill="#fff"/>
     <path d="m-7.9529 17.692s0.12266 0.0127 0.20657 0.1291c0.0839 0.11639-4e-3 1.5597 1.5148 2.539l-0.21517 0.1205c-0.653-0.34979-1.0996-0.82612-1.4805-1.8247z" fill="#ff2d2d"/>
     <path d="m10.784 20.102h-0.40453v0.2496h-0.24099l-0.45617 1.4804s0.23747 0.03735 0.49059-0.16353c0.25312-0.20088 0.44088-0.93122 0.61109-1.5665z" fill="#383838"/>
     <path d="m11.795 10.22-4.3332 0.8277c-2.1222 0.04343-4.202 0.1187-6.5729-0.02435l-2.1423-0.6086c4.2125-0.31607 8.7236-0.27937 13.048-0.19475z" fill="#444"/>
     <path d="m21.423 12.628-0.57206-0.31384c-0.33767-0.67174-0.95405-1.4683-1.7346-2.251 0.21326 0.0081 0.38054-0.02757 0.68855 0.14632 0.30802 0.17389 1.2085 1.1294 1.6181 2.4185z" fill="#fff"/>
     <path d="m-7.9529 12.748s0.12266-0.0127 0.20657-0.1291c0.0839-0.11639-4e-3 -1.5597 1.5148-2.539l-0.21517-0.1205c-0.653 0.34979-1.0996 0.82612-1.4805 1.8247z" fill="#ff2d2d"/>
     <path d="m10.784 10.338h-0.40453v-0.2496h-0.24099l-0.45617-1.4804s0.23747-0.037348 0.49059 0.16353c0.25312 0.20088 0.44088 0.93122 0.61109 1.5665z" fill="#383838"/>
    </g>
   </svg>`;
  }
}

export default CarView;
