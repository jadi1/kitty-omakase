export default class WelcomeScreen {
  constructor({ onStart = () => {}, onRules = () => {} } = {}) {
    this.onStart = onStart;
    this.onRules = onRules;
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
      backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/omakase-bg.png')",
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
      background: "#fff",
      boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
      textAlign: "center",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      alignItems: "center",
      justifyContent: "center"
    });

    // Title
    const titleImg = document.createElement("img");
    titleImg.src = "/kitty-omakase-title.png";
    Object.assign(titleImg.style, {
        display: "block",
        margin: "0 auto 5% auto",
        width: '65%',
        height: "auto"
    })

    const catIcon = document.createElement("img");
    catIcon.src = "/cat-icon.png";
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
      backgroundColor: 'red',
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
      width: "150px"
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
      width: "150px"
    });
    this.rulesBtn.addEventListener("click", () => this.onRules());

    btnRow.appendChild(this.startBtn);
    btnRow.appendChild(this.rulesBtn);

    // Rules modal (hidden by default)
    this.rulesModal = document.createElement("div");
    Object.assign(this.rulesModal.style, {
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

    const rulesCard = document.createElement("div");
    Object.assign(rulesCard.style, {
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

    // const rulesTitle = document.createElement("h2");
    // rulesTitle.textContent = "Rules";
    // Object.assign(rulesTitle.style, { marginTop: 0, fontSize: "18px" });

    const rulesTitle = document.createElement("img");
    rulesTitle.src = "/rules-title-resize.png";
    Object.assign(rulesTitle.style, { 
      width: "33%", 
      height: "auto",
    });

    const rulesText = document.createElement("div");
    rulesText.innerHTML = `
    <ul>
        <li>Change directions using {W, A, S, D} or {↑, ↓, ←, →} </li>
        <li>Press {e} to pick up or drop objects</li>
        <li>To chop fish, press {spacebar} when the fish is on the cutting board</li>
        <li>To cook rice, press {e} to place the rice in the pot. The rice is cooked automatically. Then press {e} again to place the rice on a plate.</li>
        <li>To deliver an order, press {e} when next to the delivery station (top of kitchen). A dish can only be delivered if it contains all the necessary ingredients and is on a plate.</li>
        <li>To trash a dish, press {e} next to the trash bin.</li>
      </ul>
    `;
    Object.assign(rulesText.style, { color: "#444", fontSize: "100%", padding: "10px" });

    const closeRulesBtn = document.createElement("button");
    closeRulesBtn.textContent = "Close";
    Object.assign(closeRulesBtn.style, {
      marginTop: "12px",
      padding: "8px 12px",
      borderRadius: "6px",
      border: "none",
      background: "#ff751f",
      fontWeight: "bold",
      color: "#fff",
      cursor: "pointer",
      height: "50%",
      width: "150px"
    });
    closeRulesBtn.addEventListener("click", () => this.closeRules());

    rulesCard.appendChild(rulesTitle);
    rulesCard.appendChild(rulesText);
    rulesCard.appendChild(closeRulesBtn);
    this.rulesModal.appendChild(rulesCard);

    // assemble card
    this.card.appendChild(titleImg);
    this.card.appendChild(btnRow);
    this.card.appendChild(catIcon);
    this.container.appendChild(this.card);

    document.body.appendChild(this.container);
    document.body.appendChild(this.rulesModal);
  }

  show() {
    if (this.container) this.container.style.display = "flex";
  }

  hide() {
    if (this.container) this.container.style.display = "none";
  }

  openRules() {
    if (this.rulesModal) this.rulesModal.style.display = "flex";
  }

  closeRules() {
    if (this.rulesModal) this.rulesModal.style.display = "none";
  }

  destroy() {
    this.startBtn.removeEventListener("click", this.onStart);
    this.rulesBtn.removeEventListener("click", this.onRules);
    if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
    if (this.rulesModal && this.rulesModal.parentNode) this.rulesModal.parentNode.removeChild(this.rulesModal);
  }
}