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
    this._render();
  }

  _setStateGameStarted() {
    this._state.gameStarted = !this._state.gameStarted;
    //меняем disabled и hide состояния при начале игры
    if (this._state.gameStarted) {
      this._setStateStonesStatus(
        this._state.stonesStatus.map((gem) => {
          return {
            ...gem,
            disabled: !this._state.gameStarted,
            hide: this._state.gameStarted,
          };
        })
      );
    }
    this._render();
  }

  _setFoundPairs() {
    let pairArrayLength = this._state.pairedStones.length === 2;
    let pairTrue = this._state.pairedStones[0] === this._state.pairedStones[1];
    console.log(this._state.gameStarted);

    if (this._state.gameStarted && pairArrayLength && pairTrue) {
      this._state.foundPairs += 1;
    } else if (!this._state.gameStarted) {
      this._state.foundPairs = 0;
    }
    this._render();
  }

  _setStatePairedStones(color) {
    //если в массиве менее 2 элементов, то заполняем его выбранным цветом
    //если более, то обнуляем и заполняем
    if (this._state.pairedStones.length < 2) {
      this._state.pairedStones.push(color);
    } else {
      this._state.pairedStones = [];
      this._state.pairedStones.push(color);
    }
    this._setFoundPairs();
    this._render();
  }

  _generateTiles() {
    return this._state.stonesStatus.map((gem) => {
      //если кликаем на показать камни то передаем hide: false, но если цвета не совпали то hide: true
      //true  console.log(this._state.gameStarted || (this._state.pairedStones[0] !== this._state.pairedStones[1] && this._state.pairedStones.length === 2), "1");
      //false console.log(!this._state.gameStarted || (this._state.pairedStones.length >= 1 && this._state.pairedStones[0] === this._state.pairedStones[1]), "2");

      if (this._state.gameStarted) {
        return new this._Stone(
          { ...gem, disabled: false, hide: true, paired: [] },
          this._setStateStonesStatus.bind(this),
          this._setStatePairedStones.bind(this)
        ).element;
      } else if (!this._state.gameStarted || this._state.pairedStones[0] === this._state.pairedStones[1]) {
        return new this._Stone(
          { ...gem, disabled: true, hide: false, paired: [] },
          this._setStateStonesStatus.bind(this),
          this._setStatePairedStones.bind(this)
        ).element;
      }
    });
  }

  _render() {
    this._subElements.btn.innerHTML = "";
    if (!this._state.gameStarted) {
      console.log(!this._state.gameStarted);

      this._subElements.btn.insertAdjacentElement(
        "beforeend",
        new this._Button({ use: "start", text: "Start game", handler: this._setStateGameStarted.bind(this) }).element
      );
    } else {
      this._subElements.btn.insertAdjacentElement(
        "beforeend",
        new this._Button({ use: "end", text: "Finish game", handler: this._setStateGameStarted.bind(this) }).element
      );
    }

    this._subElements.field.innerHTML = "";
    this._subElements.field.append(...this._generateTiles());

    this._subElements.total.innerHTML = `Total parts: ${this._state.stonesStatus.length}`;

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
  constructor({ color, img, disabled, hide, pair }, stoneStatusHandler, pairStatusHandler) {
    super();
    this._color = color;
    this._img = img;
    this._disabled = disabled;
    this._hide = hide;
    this._pair = pair;
    this._stoneStatusHandler = stoneStatusHandler;
    this._pairStatusHandler = pairStatusHandler;
    this._init();
  }

  _init() {
    super._init();
    this._addListeners();
    this._render();
    // console.log(this._hide);
  }

  _addListeners() {
    this._element.addEventListener("click", () => {
      this._stoneStatusHandler;
      this._pairStatusHandler(this._color);
      this._render();
    });
  }

  _render() {
    this._disabled ? this._element.setAttribute("disabled", "") : this._element.removeAttribute("disabled");
  }

  _getTemplate() {
    return `<button class="stone${this._hide ? "--hide" : ""}">
            	<img src=${this._img} alt="" />
          	</button>`;
  }
}

const root = document.querySelector(".root");

root.insertAdjacentElement("beforeend", new Game(Button, gems, Stone).element);

// Проблемы:
// массив пар не обновляется при старте/конце игры
// выбранные пары не становятся цветными
