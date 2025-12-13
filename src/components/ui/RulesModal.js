import ruleTitleImgSrc from '../../assets/rules-title-resize.png';

export default class RulesModal {
  constructor() {
    this._build();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  _build() {
    // Modal overlay
    this.modal = document.createElement("div");
    Object.assign(this.modal.style, {
      position: "fixed",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10001,
      background: "rgba(0,0,0,0.5)",
    });

    // Modal card
    const card = document.createElement("div");
    Object.assign(card.style, {
      width: "520px",
      maxHeight: "80vh",
      overflowY: "auto",
      padding: "20px",
      borderRadius: "8px",
      background: "#fff",
      boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
      color: "#111",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    });

    // Title
    const title = document.createElement("img");
    title.src = ruleTitleImgSrc;
    Object.assign(title.style, { 
      width: "33%", 
      height: "auto",
    });

    // Rules text
    const text = document.createElement("div");
    text.innerHTML = `
      <ul>
        <li>Change directions using {W, A, S, D} or {↑, ↓, ←, →} </li>
        <li>Press {e} to pick up or drop objects</li>
        <li>To chop fish, press {spacebar} when the fish is on the cutting board</li>
        <li>To cook rice, press {e} to place the rice in the pot. Then press {e} again to place the rice on a plate.</li>
        <li>To deliver an order, press {e} when next to the delivery station (top of kitchen). A dish can only be delivered if it contains all the necessary ingredients and is on a plate.</li>
        <li>To trash a dish, press {e} next to the trash bin.</li>
      </ul>
    `;
    Object.assign(text.style, { 
      color: "#444", 
      fontSize: "100%", 
      padding: "10px" 
    });

    // Close button
    this.closeBtn = document.createElement("button");
    this.closeBtn.textContent = "Close";
    Object.assign(this.closeBtn.style, {
      marginTop: "12px",
      padding: "8px 12px",
      borderRadius: "6px",
      border: "none",
      background: "#ff751f",
      fontWeight: "bold",
      color: "#fff",
      cursor: "pointer",
      height: "50%",
      width: "150px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
    });
    this.closeBtn.addEventListener("click", () => this.hide());

    // Assemble
    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(this.closeBtn);
    this.modal.appendChild(card);
    
    document.body.appendChild(this.modal);
  }

  handleKeyDown(event) {
    if (event.key === "Escape" && this.modal.style.display === "flex") {
      this.hide();
    }
  }

  show() {
    if (this.modal) {
      this.modal.style.display = "flex";
      document.addEventListener("keydown", this.handleKeyDown);
    }
  }

  hide() {
    if (this.modal) {
      this.modal.style.display = "none";
      document.removeEventListener("keydown", this.handleKeyDown);
    }
  }

  destroy() {
    this.closeBtn.removeEventListener("click", this.hide);
    document.removeEventListener("keydown", this.handleKeyDown);
    if (this.modal && this.modal.parentNode) {
      this.modal.parentNode.removeChild(this.modal);
    }
  }
}