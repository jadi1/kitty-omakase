export default class EndScreenModal {
  constructor({ onRestart = () => {}, onQuit = () => {} } = {}) {
    this.onRestart = onRestart;
    this.onQuit = onQuit;
    this._build();
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
      zIndex: 10000,
      background: "rgba(0,0,0,0.5)",
    });

    // Modal card
    const card = document.createElement("div");
    Object.assign(card.style, {
      width: "400px",
      padding: "30px",
      borderRadius: "8px",
      background: "#fff",
      boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
      color: "#111",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    });

    // Title
    const title = document.createElement("h2");
    title.textContent = "CONGRATS!";
    Object.assign(title.style, { 
      marginTop: 0,
      marginBottom: "10px",
      fontSize: "32px",
      fontWeight: "bold",
      color: "#ff751f"
    });

    // sushi roll counter. TODO: fill in score
    const rollCounterText = document.createElement("h4");
    rollCounterText.textContent = "You made xx sushi rolls";
    Object.assign(rollCounterText.style, { 
      marginTop: 0,
      marginBottom: "15px",
      fontSize: "20px",
      fontWeight: "bold",
      color: "#ff751f"
    });

    // Buttons container
    const btnContainer = document.createElement("div");
    Object.assign(btnContainer.style, {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      width: "100%",
    });

    // Restart button
    this.restartBtn = document.createElement("button");
    this.restartBtn.textContent = "RESTART";
    Object.assign(this.restartBtn.style, {
      padding: "12px 16px",
      borderRadius: "10px",
      border: "none",
      background: "#ff751f",
      color: "#fff",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      width: "100%",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
    });
    this.restartBtn.addEventListener("click", () => this.onRestart());

    // Quit button
    this.quitBtn = document.createElement("button");
    this.quitBtn.textContent = "MAIN MENU";
    Object.assign(this.quitBtn.style, {
      padding: "12px 16px",
      borderRadius: "10px",
      border: "2px solid #ff751f",
      background: "#fff",
      color: "#ff751f",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      width: "100%",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
    });
    this.quitBtn.addEventListener("click", () => this.onQuit());

    // Assemble
    btnContainer.appendChild(this.restartBtn);
    btnContainer.appendChild(this.quitBtn);
    card.appendChild(title);
    card.appendChild(rollCounterText);
    card.appendChild(btnContainer);
    this.modal.appendChild(card);
    
    document.body.appendChild(this.modal);
  }

  show() {
    if (this.modal) this.modal.style.display = "flex";
  }

  hide() {
    if (this.modal) this.modal.style.display = "none";
  }

  destroy() {
    this.restartBtn.removeEventListener("click", this.onRestart);
    this.quitBtn.removeEventListener("click", this.onQuit);
    if (this.modal && this.modal.parentNode) {
      this.modal.parentNode.removeChild(this.modal);
    }
  }
}