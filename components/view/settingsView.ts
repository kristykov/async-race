import AbstractComponentView from './abstractComponentView';

type HandlerCreateCar = (name: string, color: string) => void;

class SettingsView extends AbstractComponentView {
  constructor() {
    super();
  }

  draw(container: HTMLTemplateElement) {
    container.innerHTML = '';
    container.innerHTML += `<section class="settings-section">
        <div class="color-section">
            <input type="text" id="create-name-display"></input>
            <input type="color" id="create-color" name="create-color" value="#cbdae5" />
            <button class="blue-btn" id="create-btn">Create</button>
        </div>
        <div class="color-section">
            <input type="text" id="update-name-display"></input>
            <input type="color" id="update-color" name="update-color" value="#798791" />
            <button class="blue-btn" id="update-btn">Update</button>
        </div>
        <div class="other-settings">
            <button class="green-btn" id="race-btn">Race</button>
            <button class="green-btn" id="reset-btn">Reset</button>
            <button class="blue-btn" id="generate-btn">Generate Cars</button>
        </div>
    </section>`;
  }

  bindCreateCar(handler: HandlerCreateCar) {
    const createBtn = document.getElementById('create-btn') as HTMLElement;
    createBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // get text input for name and color
      // check if inputs are not empty strings
      // if valid call handler
      handler('tesla', '#ff0000');
      // reset inputs
    });
  }
}

export default SettingsView;
