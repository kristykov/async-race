import WinnersView from './winnersView';
import GarageView from './garageView';
import AbstractPageView from './abstractPageView';
import AbstractComponentView from './abstractComponentView';
import { ICars } from '../interfaces/ICars';
import { IWinners } from '../interfaces/IWinners';
import Controller from '../controller/controller';

class AppView {
  garageView: GarageView;
  winnersView: WinnersView;
  currentView: AbstractPageView;
  garageBtn: HTMLElement;
  winnersBtn: HTMLElement;
  controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
    this.garageView = new GarageView(this.controller);
    this.winnersView = new WinnersView(this.controller);
    this.currentView = this.garageView;
    this.garageBtn = document.getElementById('garage-btn') as HTMLElement;
    this.winnersBtn = document.getElementById('winners-btn') as HTMLElement;
  }

  drawGarageView(data: ICars) {
    this.currentView = this.garageView;
    this.currentView.draw(data);
  }

  drawWinnersView(data: IWinners) {
    this.currentView = this.winnersView;
    this.currentView.draw(data);
  }
}

export default AppView;
