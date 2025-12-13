import tunaImage from '../../assets/tuna-recipe-card.png';
import salmonImage from '../../assets/salmon-recipe-card.png';
import { food } from "../constants"

const recipes = {
  tuna: {
    recipeName: food.TUNASUSHI,
    ingredients: ["tuna", "rice", "nori"],
    cardImg: tunaImage,
  },
  salmon: {
    recipeName: food.SALMONSUSHI,
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
        this.recipeName = recipeData.recipeName;
        this._build();
    }
    _build() {
        // Card container
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

    pulseGreen() {
        // Apply transition for smooth animation
        this.container.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";

        // Scale up and add glow
        this.container.style.transform = "scale(1.1)";
        this.container.style.boxShadow = "0 0 20px rgba(76, 175, 80, 0.8)";

        // After a short delay, scale back to normal
        setTimeout(() => {
            this.container.style.transform = "scale(1)";
            this.container.style.boxShadow = "0 0 0px rgba(76, 175, 80, 0)";
        }, 2000); // matches transition duration
    }

    pulseRed() {
        // Apply transition for smooth animation
        this.container.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";

        // Scale up and add glow
        this.container.style.transform = "scale(1.1)";
        this.container.style.boxShadow = "0 0 20px rgba(220, 0, 0, 0.8)";

        // After a short delay, scale back to normal
        setTimeout(() => {
            this.container.style.transform = "scale(1)";
            this.container.style.boxShadow = "0 0 0px rgba(76, 175, 80, 0)";
        }, 200); // matches transition duration
    }
}
export default RecipeCard;