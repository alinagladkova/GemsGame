"use strict";

function createElement(html) {
  const root = document.createElement("div");
  root.insertAdjacentHTML("beforeend", html);
  return root.firstElementChild;
}

class BasicComponent {
  _element = null;
  _subElements = {};

  constructor() {}

  _init() {
    this._element = createElement(this._getTemplate());
    this._subElements = this._getSubElements();
  }

  _getSubElements() {
    return Array.from(this._element.querySelectorAll("[data-element]")).reduce((acc, el) => {
      return {
        ...acc,
        [el.getAttribute("data-element")]: el,
      };
    }, {});
  }

  get element() {
    return this._element;
  }
}

const gems = [
  {
    id: 11,
    color: "red",
    img: "./img/t1.png",
  },
  {
    id: 52,
    color: "blue",
    img: "./img/t2.png",
  },
  {
    id: 73,
    color: "green",
    img: "./img/t3.png",
  },
  {
    id: 41,
    color: "purple",
    img: "./img/t4.png",
  },
  {
    id: 43,
    color: "red",
    img: "./img/t1.png",
  },
  {
    id: 56,
    color: "blue",
    img: "./img/t2.png",
  },
  {
    id: 67,
    color: "green",
    img: "./img/t3.png",
  },
  {
    id: 433,
    color: "purple",
    img: "./img/t4.png",
  },
  {
    id: 567,
    color: "red",
    img: "./img/t1.png",
  },
  {
    id: 345,
    color: "blue",
    img: "./img/t2.png",
  },
  {
    id: 234,
    color: "green",
    img: "./img/t3.png",
  },
  {
    id: 546,
    color: "purple",
    img: "./img/t4.png",
  },
  {
    id: 78,
    color: "red",
    img: "./img/t1.png",
  },
  {
    id: 34,
    color: "blue",
    img: "./img/t2.png",
  },
  {
    id: 547,
    color: "green",
    img: "./img/t3.png",
  },
  {
    id: 98,
    color: "purple",
    img: "./img/t4.png",
  },
];

class Game extends BasicComponent {
  _state = {
    stonesStatus: [],
    gameStarted: false,
    pairedStones: [],
    foundPairs: 0,
  };

  constructor(Button, gems, Stone) {
    super();
    this._Button = Button;
    this._gems = gems;
    this._Stone = Stone;
    this._init();
  }

  _init() {
    super._init();
    this._setStateStonesStatus(
      this._gems.map((gem) => {
        return {
          ...gem,
          disabled: true,
          hide: false,
        };
      })
    );
    this._gems = undefined; // чтобы не работать без состояния
    this._render();
  }

  _setStateStonesStatus(stonesStatus) {
    this._state.stonesStatus = stonesStatus;
  }

  _setFoundPairs(num) {
    this._state.foundPairs = num;
  }

  _setStatePairedStones(obj) {
    if (this._state.pairedStones.length === 2) {
      this._state.pairedStones = [obj];
      return;
    }
    this._state.pairedStones = [...this._state.pairedStones, obj];
  }

  _isMatched() {
    if (this._state.pairedStones.length < 2) {
      return false;
    }
    if (this._state.pairedStones[0].color === this._state.pairedStones[1].color) {
      return true;
    }
    return false;
  }

  _setStateGameStarted() {
    this._state.gameStarted = !this._state.gameStarted;
  }

  _stonesStatusHandler(obj) {
    if (this._state.pairedStones.length === 1 && this._state.pairedStones[0].id === obj.id) {
      return;
    }

    this._setStatePairedStones(obj);

    if (this._isMatched()) {
      // значит пара найдена
      const idsMatched = [this._state.pairedStones[0].id, this._state.pairedStones[1].id];

      this._setStateStonesStatus(
        this._state.stonesStatus.map((gem) => {
          if (idsMatched.includes(gem.id)) {
            return {
              ...gem,
              disabled: true,
              hide: false,
            };
          }
          return gem;
        })
      );
      this._setFoundPairs(this._state.foundPairs + 1);
    }
    this._render();
  }

  _handleStartGame() {
    this._setStateGameStarted();

    if (this._state.gameStarted) {
      this._setStateStonesStatus(
        this._state.stonesStatus.map((gem) => {
          return {
            ...gem,
            disabled: false,
            hide: true,
          };
        })
      );
    } else {
      this._setStateStonesStatus(
        this._state.stonesStatus.map((gem) => {
          return {
            ...gem,
            disabled: true,
            hide: false,
          };
        })
      );
      this._setFoundPairs(0);
    }

    this._render();
  }

  _generateTiles() {
    return this._state.stonesStatus.map((gem) => new this._Stone(gem, this._stonesStatusHandler.bind(this)).element);
  }

  _generateButton() {
    return new this._Button({
      use: "start",
      text: this._state.gameStarted ? "Finish game" : "Start game",
      handler: this._handleStartGame.bind(this),
    }).element;
  }

  _checkTotalPairs() {
    return Object.values(
      this._state.stonesStatus.reduce((acc, gem) => {
        if (acc[gem.color]) {
          acc[gem.color] += 1;
        } else {
          acc[gem.color] = 1;
        }
        return acc;
      }, {})
    ).reduce((acc, num) => {
      let result = Math.floor(num / 2);
      return acc + result;
    }, 0);
  }

  _render() {
    this._subElements.field.innerHTML = "";
    this._subElements.field.append(...this._generateTiles());

    this._subElements.btn.innerHTML = "";
    this._subElements.btn.append(this._generateButton());

    this._subElements.total.innerHTML = `Total parts: ${this._checkTotalPairs()}`;

    !this._state.gameStarted
      ? (this._subElements.found.innerHTML = `Found parts: ${0}`)
      : (this._subElements.found.innerHTML = `Found parts: ${this._state.foundPairs}`);
  }

  _getTemplate() {
    return `<div class="game">
							<div class="game__button" data-element="btn"></div>
							<div class="game__info">
         				<p class="game__found" data-element="found"></p>
          			<p class="game__total" data-element="total"></p>
        			</div>
							<div class="game__field" data-element="field"></div>
						</div>`;
  }
}

class Button extends BasicComponent {
  constructor({ use, text, handler }) {
    super();
    this._use = use;
    this._text = text;
    this._handler = handler;
    this._init();
  }

  _init() {
    super._init();
    this._addListeners();
  }

  _addListeners() {
    this._element.addEventListener("click", this._handler);
  }

  _getTemplate() {
    return `<button class="btn btn--${this._use}">${this._text}</button>`;
  }
}

class Stone extends BasicComponent {
  constructor({ id, color, img, disabled, hide }, stoneStatusHandler) {
    super();
    this._id = id;
    this._color = color;
    this._img = img;
    this._disabled = disabled;
    this._hide = hide;
    this._stoneStatusHandler = stoneStatusHandler;
    this._init();
  }

  _init() {
    super._init();
    this._addListeners();
  }

  _addListeners() {
    this._element.addEventListener("click", () => {
      this._stoneStatusHandler({ id: this._id, color: this._color });
    });
  }

  _getTemplate() {
    return `<button class="stone ${this._hide ? "stone--hide" : ""}" ${this._disabled ? "disabled" : ""}>
            	<img src=${this._img} alt="" />
          	</button>`;
  }
}

const root = document.querySelector(".root");
root.insertAdjacentElement("beforeend", new Game(Button, gems, Stone).element);
