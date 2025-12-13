export default class MuteButton {
  constructor({ onToggleMute = () => {} } = {}) {
    this.onToggleMute = onToggleMute;
    this.isMuted = false;
    this._build();
  }

  _build() {
    // Mute button in top-right corner (below pause button)
    this.button = document.createElement("button");
    this.button.innerHTML = "&#128266;"; // Speaker icon (unmuted)
    Object.assign(this.button.style, {
      position: "fixed",
      top: "80px", // Below the pause button
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
    this.button.addEventListener("click", () => {
      this.isMuted = !this.isMuted;
      this.updateIcon();
      this.onToggleMute(this.isMuted);
    });
    
    document.body.appendChild(this.button);
  }

  updateIcon() {
    // Update button icon based on mute state
    this.button.innerHTML = this.isMuted ? "&#128264;" : "&#128266;"; // Muted vs Unmuted speaker
  }

  show() {
    if (this.button) this.button.style.display = "flex";
  }

  hide() {
    if (this.button) this.button.style.display = "none";
  }

  destroy() {
    this.button.removeEventListener("click", this.onToggleMute);
    if (this.button && this.button.parentNode) {
      this.button.parentNode.removeChild(this.button);
    }
  }
}