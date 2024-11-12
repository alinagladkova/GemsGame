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
    id: 546,
    color: "green",
    img: "./img/t3.png",
  },
  {
    id: 78,
    color: "purple",
    img: "./img/t4.png",
  },
];

class Game extends BasicComponent {
  _state = {
    stonesStatus: [],
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

  _render() {
    this._subElements.btn.insertAdjacentElement(
      "beforeend",
      new this._Button({ use: "start", text: "Start game", handler: () => console.log("click") }).element
    );
    this._subElements.field.innerHTML = "";
    this._subElements.field.append(...this._generateTiles());
  }

  _generateTiles() {
    return this._state.stonesStatus.map((gem) => {
      return new this._Stone(gem).element; //передать handler
    });
  }

  _getTemplate() {
    return `<div class="game">
							<div class="game__button" data-element="btn"></div>
							<div class="game__info">
         				<p class="game__found">Found parts: ${0}</p>
          			<p class="game__total">Total parts: ${2}</p>
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
  constructor({ color, img, hide, pair, disabled }) {
    super();
    this._color = color;
    this._img = img;
    this._hide = hide;
    this._pair = pair;
    this._disabled = disabled;

    this._init();
  }

  _init() {
    super._init();
  }

  _getTemplate() {
    return `<button class="stone">
            	<img src=${this._img} alt="" />
          	</button>`;
  }
}

const root = document.querySelector(".root");

root.insertAdjacentElement("beforeend", new Game(Button, gems, Stone).element);
