import { ICar } from '../interfaces/ICar';
import { ICars } from '../interfaces/ICars';
import { IWinners } from '../interfaces/IWinners';
import { IWinner } from '../interfaces/IWinner';

class Model {
  private base: string = 'http://localhost:3000';
  private garage: string = `${this.base}/garage`;
  private engine: string = `${this.base}/engine`;
  private winners: string = `${this.base}/winners`;
  allCarsData: ICars | undefined;
  carsData: ICars | undefined;
  idCounter: number;

  constructor() {
    this.allCarsData = undefined;
    this.idCounter = 4;
  }

  getCars = async (page: string, limit = 7) => {
    const response = (
      await fetch(`${this.garage}?_page=${page}&_limit=${limit}`)
    ).json();

    this.carsData = await response;
    return response;
  };

  getAllCars = async () => {
    const data = (await fetch(`${this.garage}`)).json();
    this.allCarsData = await data;
    return data;
  };

  getCar = async (id: string) => (await fetch(`${this.garage}/${id}`)).json();

  createCar = async (data: ICar) => {
    const response = (
      await fetch(this.garage, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  };

  create100Cars = async (data: ICars) => {
    const response = (
      await fetch(this.garage, {
        method: 'PUT',
        body: JSON.stringify([...data]),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  };

  deleteCar = async (id: string) => {
    const response = (
      await fetch(`${this.garage}/${id}`, {
        method: 'DELETE',
      })
    ).json();
  };

  updateCar = async (id: string, data: ICar) => {
    const response = (
      await fetch(`${this.garage}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  };

  startEngine = async (id: string) =>
    (
      await fetch(`${this.engine}?id=${id}&status=started`, { method: 'PATCH' })
    ).json();

  stopEngine = async (id: string) =>
    (await fetch(`${this.engine}?id=${id}&status=stopped`)).json();

  drive = async (id: string) => {
    const res = await fetch(`${this.engine}?id=${id}&status=drive`, {
      method: 'PATCH',
    }).catch();
    return res.status !== 200 ? { success: false } : { ...(await res.json()) };
  };

  getSortOrder(sort: string, order: string) {
    return sort && order ? `&_sort=${sort}&_order=${order}` : '';
  }

  getWinners = async (options: {
    page: string;
    limit: number;
    sort: string;
    order: string;
  }) => {
    const response = await fetch(
      `${this.winners}?_page=${options.page}&_limit=${
        options.limit
      }${this.getSortOrder(options.sort, options.order)}`
    );
    const items = await response.json();

    return {
      items: items /* await Promise.all(
        items.map(async (winner: IWinners) => ({
          ...winner,
          car: await this.getCar(winner.id.toString()),
        }))
      )*/,
      count: response.headers.get('X-Total-Count'),
    };
  };

  getWinner = async (id: string) =>
    (await fetch(`${this.winners}/${id}`)).json();

  getWinnerStatus = async (id: string) =>
    (await fetch(`${this.winners}/${id}`)).status;

  deleteWinner = async (id: string) =>
    (await fetch(`${this.winners}/${id}`, { method: 'DELETE' })).json();

  createWinner = async (data: IWinner) => {
    const response = (
      await fetch(this.winners, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  };

  updateWinner = async (id: string, data: IWinner) =>
    (
      await fetch(`${this.winners}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();

  saveWinner = async (
    car: { time: number; name: string; color: string; id: number } | undefined
  ) => {
    if (car && Object.keys(car).length === 1) return;
    if (!car) return;
    const winnerStatus = await this.getWinnerStatus(car.id.toString());

    if (winnerStatus === 404) {
      await this.createWinner({
        id: car.id,
        wins: 1,
        time: car.time,
      });
    } else {
      const winner = await this.getWinner(car.id.toString());
      await this.updateWinner(car.id.toString(), {
        id: car.id,
        wins: winner.wins + 1,
        time: car.time < winner.time ? car.time : winner.time,
      });
    }
  };
}

export default Model;
