export default class ScoreLabel {
  constructor() {
    this.score = 0;
    this._build();
  }

  _build() {
    this.container = document.createElement("div");
    Object.assign(this.container.style, {
      position: "fixed",
      top: "12px",
      right: "12px",
      zIndex: 9999,
      pointerEvents: "auto",
    });

    this.scoreNumber = document.createElement("div");
    Object.assign(this.scoreNumber.style, {
      fontSize: "48px",
      fontWeight: "700",
      color: "#fff",
      fontFamily: "'Courier New', monospace",
      letterSpacing: "2px",
      textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
      transition: "transform 0.2s ease, text-shadow 0.2s ease",
      transform: "scale(1)",
    });

    this.scoreNumber.textContent = this.score;
    this.container.appendChild(this.scoreNumber);
  }

  updateScore(newScore) {
    const oldScore = this.score;
    this.score = newScore;
    this.score = Math.max(0, newScore);
    this.scoreNumber.textContent = this.score;

    // pulse animation on update
    if (newScore > oldScore) {
      this.scoreNumber.style.transform = "scale(1.15)";
      this.scoreNumber.style.textShadow = "0 4px 16px rgba(76, 175, 80, 0.6)";
      setTimeout(() => {
        this.scoreNumber.style.transform = "scale(1)";
        this.scoreNumber.style.textShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
      }, 200);
    } else { // pulse red
      this.scoreNumber.style.transform = "scale(1.15)";
      this.scoreNumber.style.textShadow = "0 4px 16px rgba(171, 5, 5, 0.6)";
      setTimeout(() => {
        this.scoreNumber.style.transform = "scale(1)";
        this.scoreNumber.style.textShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
      }, 200);
    }
  }

  addScore(points) {
    this.updateScore(this.score + points);
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