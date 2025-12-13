export default class PauseModal {
  constructor({ onRules = () => {}, onQuit = () => {}, onPause = () => {} } = {}) {
    this.onRules = onRules;
    this.onQuit = onQuit;
    this.onPause = onPause;

    this._onRulesClick = () => this.onRules();
    this._onQuitClick = () => this.onQuit();
    this._onResumeClick = () => this.onPause(); // resume should toggle pause (GameScene will hide modal)
    this._onPauseBtnClick = () => this.onPause(); // top-right pause button should toggle pause (GameScene will show modal)

    this._build();
    this._buildPauseButton();
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
    title.textContent = "PAUSED";
    Object.assign(title.style, { 
      marginTop: 0,
      marginBottom: "30px",
      fontSize: "32px",
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

    // Rules button
    this.rulesBtn = document.createElement("button");
    this.rulesBtn.textContent = "RULES";
    Object.assign(this.rulesBtn.style, {
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
    this.rulesBtn.addEventListener("click", () => this._onRulesClick());

    // Quit button
    this.quitBtn = document.createElement("button");
    this.quitBtn.textContent = "QUIT";
    Object.assign(this.quitBtn.style, {
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
    this.quitBtn.addEventListener("click", () => this._onQuitClick());

    // Resume button
    this.resumeBtn = document.createElement("button");
    this.resumeBtn.textContent = "RESUME";
    Object.assign(this.resumeBtn.style, {
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
    this.resumeBtn.addEventListener("click", () => this._onResumeClick());

    // Assemble
    btnContainer.appendChild(this.resumeBtn);
    btnContainer.appendChild(this.rulesBtn);
    btnContainer.appendChild(this.quitBtn);
    card.appendChild(title);
    card.appendChild(btnContainer);
    this.modal.appendChild(card);
    
    document.body.appendChild(this.modal);
  }

  _buildPauseButton() {
    // Pause button in top-right corner
    this.pauseButton = document.createElement("button");
    this.pauseButton.innerHTML = "&#10074;&#10074;"; // Pause icon (two vertical bars)
    Object.assign(this.pauseButton.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      width: "50px",
      height: "50px",
      borderRadius: "10px",
      border: "none",
      background: "#ff751f",
      color: "#fff",
      cursor: "pointer",
      fontSize: "24px",
      fontWeight: "bold",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
      zIndex: 9998,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif"
    });
    this.pauseButton.addEventListener("click", this._onPauseBtnClick);
    
    document.body.appendChild(this.pauseButton);
  }

  show() {
    if (this.modal) this.modal.style.display = "flex";
    if (this.pauseButton) this.pauseButton.style.display = "flex";
  }

  hide() {
    if (this.modal) this.modal.style.display = "none";
    if (this.pauseButton) this.pauseButton.style.display = "flex";
  }

  showPauseButton() {
    if (this.pauseButton) this.pauseButton.style.display = "flex";
  }

  hidePauseButton() {
    if (this.pauseButton) this.pauseButton.style.display = "none";
  }

  destroy() {
    this.rulesBtn.removeEventListener("click", this.onRules);
    this.quitBtn.removeEventListener("click", this.onQuit);
    this.resumeBtn.removeEventListener("click", this.hide);
    this.pauseButton.removeEventListener("click", this.show);
    if (this.modal && this.modal.parentNode) {
      this.modal.parentNode.removeChild(this.modal);
    }
    if (this.pauseButton && this.pauseButton.parentNode) {
      this.pauseButton.parentNode.removeChild(this.pauseButton);
    }
  }
}