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
    path: "./img/t1.png",
  },
  {
    id: 52,
    color: "blue",
    path: "./img/t2.png",
  },
  {
    id: 73,
    color: "green",
    path: "./img/t3.png",
  },
  {
    id: 41,
    color: "purple",
    path: "./img/t4.png",
  },
];

class Game extends BasicComponent {
  constructor(Button, GameInfo, GameField, gems, Gem) {
    super();
    this._Button = Button;
    this._GameInfo = GameInfo;
    this._GameField = GameField;
    this._gems = gems;
    this._Gem = Gem;
    this._init();
  }

  _init() {
    super._init();
    this._render();
  }

  _render() {
    this._subElements.btn.insertAdjacentElement("beforeend", new this._Button().element);
    this._element.insertAdjacentElement("beforeend", new this._GameInfo().element);
    this._element.insertAdjacentElement("beforeend", new this._GameField(this._gems, this._Gem).element);
  }

  _getTemplate() {
    return `<div class="game">
							<div class="game__button" data-element="btn"></div>
						</div>`;
  }
}

class Button extends BasicComponent {
  constructor() {
    super();
    this._init();
  }
  _init() {
    super._init();
    this._addListeners();
  }

  _addListeners() {}

  _getTemplate() {
    return `<button class="btn btn--start">Start game</button>`;
  }
}
class GameInfo extends BasicComponent {
  constructor() {
    super();
    this._init();
  }
  _init() {
    super._init();
  }

  _getTemplate() {
    return `<div class="game__info">
         			<p class="info__found">Found parts: ${0}</p>
          		<p class="info__total">Total parts: ${2}</p>
        		</div>`;
  }
}

class GameField extends BasicComponent {
  constructor(gems, Gem) {
    super();
    this._gems = gems;
    this._Gem = Gem;
    this._init();
  }

  _init() {
    super._init();
    this._render();
  }

  _generateGems() {
    return gems.map((gem) => {
      return new this._Gem(gem).element;
    });
  }

  _render() {
    this._element.append(...this._generateGems());
  }

  _getTemplate() {
    return `<ul class="game__field"></ul>`;
  }
}

class Gem extends BasicComponent {
  constructor({ id, color, path }) {
    super();
    this._id = id;
    this._color = color;
    this._path = path;
    this._init();
  }

  _init() {
    super._init();
  }

  _getTemplate() {
    return `<li class="field__gem">
            	<img src=${this._path} alt="img" />
          	</li>`;
  }
}

class GemList extends BasicComponent {}

const root = document.querySelector(".root");

// root.insertAdjacentElement("beforeend", new Game(Button).element);

root.insertAdjacentElement("beforeend", new Game(Button, GameInfo, GameField, gems, Gem).element);
