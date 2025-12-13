export default class TimerLabel {
  constructor() {
    this.label = "3:00:00";
    this._build();
  }

  _build() {
    this.container = document.createElement("div");
    Object.assign(this.container.style, {
      position: "fixed",
      bottom: "18px",
      right: "20px",
      zIndex: 9999,
      pointerEvents: "auto",
      // NEW
      background: "rgba(0, 0, 0, 0.45)",
      borderRadius: "14px",
      padding: "10px 18px",
      backdropFilter: "blur(6px)",       // optional but nice
      boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
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

    this.scoreNumber.textContent = this.label;
    this.container.appendChild(this.scoreNumber);
  }

  setText(text) {
    this.label = text;
    if (this.scoreNumber) {
      this.scoreNumber.textContent = text;
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