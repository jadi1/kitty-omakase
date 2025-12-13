import RulesModal from './RulesModal.js';
import titleSrc from '../../assets/kitty-omakase-title.png';
import bgSrc from '../../assets/omakase-bg.png';
import catSrc from '../../assets/cat-icon.png'

export default class WelcomeScreen {
  constructor({ onStart = () => {} } = {}) {
    this.onStart = onStart;
    this.rulesModal = new RulesModal();
    this._build();
  }

  _build() {
    // Wrapper
    this.container = document.createElement("div");
    Object.assign(this.container.style, {
      position: "fixed",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "auto",
      zIndex: 9999,
      backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgSrc})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    });

    // Card
    this.card = document.createElement("div");
    Object.assign(this.card.style, {
      position: "relative",
      width: "60%",
      padding: "10px",
      borderRadius: "8px",
      textAlign: "center",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      alignItems: "center",
      justifyContent: "center"
    });

    // Title
    const titleImg = document.createElement("img");
    titleImg.src = titleSrc;
    Object.assign(titleImg.style, {
      display: "block",
      margin: "0 auto 5% auto",
      width: '65%',
      height: "auto"
    });

    const catIcon = document.createElement("img");
    catIcon.src = catSrc;
    Object.assign(catIcon.style, {
      position: "absolute",
      bottom: "0", 
      left: "0", 
      width: "33%", 
      height: "auto",
      marginTop: 100,
    });

    // Buttons container
    const btnRow = document.createElement("div");
    Object.assign(btnRow.style, {
      display: "flex",
      gap: "5%",
      justifyContent: "center",
      margin: "-8% 0 10% 0",
      padding: "10px 0 20px 0",
      height: '100%',
    });

    // Start button
    this.startBtn = document.createElement("button");
    this.startBtn.textContent = "START";
    Object.assign(this.startBtn.style, {
      padding: "10px 16px",
      borderRadius: "10px",
      border: "none",
      background: "#ff751f",
      color: "#fff",
      cursor: "pointer",
      fontSize: "100%",
      fontWeight: "bold",
      height: "50%",
      width: "150px",
      boxShadow: "2px 4px 10px rgba(0,0,0,0.3)"
    });
    this.startBtn.addEventListener("click", () => this.onStart());

    // Rules button
    this.rulesBtn = document.createElement("button");
    this.rulesBtn.textContent = "RULES";
    Object.assign(this.rulesBtn.style, {
      padding: "10px 0px",
      borderRadius: "10px",
      border: "none",
      background: "#ff751f",
      color: "#fff",
      cursor: "pointer",
      fontSize: "100%",
      fontWeight: "bold",
      height: "50%",
      width: "150px",
      boxShadow: "2px 4px 10px rgba(0,0,0,0.3)"
    });
    this.rulesBtn.addEventListener("click", () => this.rulesModal.show());

    btnRow.appendChild(this.startBtn);
    btnRow.appendChild(this.rulesBtn);

    // Assemble card
    this.card.appendChild(titleImg);
    this.card.appendChild(btnRow);
    this.card.appendChild(catIcon);
    this.container.appendChild(this.card);

    document.body.appendChild(this.container);
  }

  show() {
    if (this.container) this.container.style.display = "flex";
  }

  hide() {
    if (this.container) this.container.style.display = "none";
  }

  destroy() {
    this.startBtn.removeEventListener("click", this.onStart);
    this.rulesBtn.removeEventListener("click", () => this.rulesModal.show());
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.rulesModal.destroy();
  }
}