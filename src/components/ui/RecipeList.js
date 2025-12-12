import RecipeCard from "./RecipeCard.js";

export default class RecipeList {
  constructor() {
    const recipes = ["tuna", "salmon"];
    const getRandomRecipe = () => recipes[Math.floor(Math.random() * recipes.length)];
    this.getRandomRecipe = getRandomRecipe;
    this._build();
    this._initCards();
  }

  _build() {
    this.container = document.createElement("div");
    Object.assign(this.container.style, {
      position: "fixed",
      top: "12px",
      left: "12px",
      zIndex: 9999,
      pointerEvents: "auto",
      color: "#fff",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
    });

    // cards wrapper
    this.cardsWrapper = document.createElement("div");
    Object.assign(this.cardsWrapper.style, {
      display: "flex",
      flexWrap: "wrap",
      gap: "1px",
      height:"100px"
    });
    this.container.appendChild(this.cardsWrapper);
  }
  _initCards() {
    // create recipe cards you want to show
    //TODO: repopulation logic
    this.cards = [
      new RecipeCard(this.getRandomRecipe()),
      new RecipeCard(this.getRandomRecipe()),
      new RecipeCard(this.getRandomRecipe())
    ];

    for (const card of this.cards) {
      card.appendTo(this.cardsWrapper);
    }
  }

  show() {
    if (!this.container.parentNode) document.body.appendChild(this.container);
  }

  hide() {
    if (this.container.parentNode) this.container.parentNode.removeChild(this.container);
  }

  destroy() {
    this.hide();
    this.container = null;
  }
}