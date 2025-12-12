import tunaImage from '../../assets/tuna-recipe-card.png';
import salmonImage from '../../assets/salmon-recipe-card.png';

const recipes = {
  tuna: {
    ingredients: ["tuna", "rice", "nori"],
    cardImg: tunaImage,
  },
  salmon: {
    ingredients: ["salmon", "rice", "nori"],
    cardImg: salmonImage,
  }
};

class RecipeCard {
    constructor(foodLabel) {
        const recipeData = recipes[foodLabel];
    
        if (!recipeData) {
            console.error("Unknown recipe:", foodLabel);
            return;
        }

        this.foodLabel = foodLabel;
        this.ingredients = recipeData.ingredients;
        this.cardImg = recipeData.cardImg;
        this._build();
    }
    _build() {
        // Card container
        console.log("building")
        this.container = document.createElement("div");
            Object.assign(this.container.style, {
            display: "inline-block",
            width: "150px",
            height: "150px",
            margin: "4px",
            borderRadius: "8px",
            overflow: "hidden",
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        });
        
        Image
        this.imageEl = document.createElement("img");
        this.imageEl.src = this.cardImg;
        Object.assign(this.imageEl.style, {
        width: "100%",
        objectFit: "cover",
        });
        this.container.appendChild(this.imageEl);

    }
    
    // Append card to a parent element
    appendTo(parentElement) {
        console.log('appendTo called', parentElement, "this", this.container);
        if (parentElement && this.container) {
            parentElement.appendChild(this.container);
        }
    }
    
    // Remove card from DOM
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}
export default RecipeCard;