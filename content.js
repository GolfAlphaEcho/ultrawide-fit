(() => {
  const STYLE_ID = "yt-ultrawide-style";

  // YouTube sizes the <video> element inline to keep 16:9, so we override that
  // and let object-fit decide how the picture fills the (wider) player.
  const base = `
    .html5-video-player .html5-video-container {
      width: 100% !important;
      height: 100% !important;
    }
    .html5-video-player video.html5-main-video {
      width: 100% !important;
      height: 100% !important;
      left: 0 !important;
      top: 0 !important;
      object-fit: FIT !important;
    }`;

  const CSS = {
    off: "",
    zoom: base.replace("FIT", "cover"),   // fill, keep aspect, crop edges
    stretch: base.replace("FIT", "fill")  // fill, distort to fit
  };

  function applyMode(mode) {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    style.textContent = CSS[mode] || "";
  }

  function toast(mode) {
    const player = document.querySelector(".html5-video-player");
    if (!player) return;
    let el = document.getElementById("yt-ultrawide-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "yt-ultrawide-toast";
      Object.assign(el.style, {
        position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.75)", color: "#fff", padding: "6px 14px",
        borderRadius: "6px", font: "600 14px Roboto, Arial, sans-serif",
        zIndex: "9999", pointerEvents: "none", transition: "opacity 0.3s"
      });
      player.appendChild(el);
    }
    el.textContent = `Ultrawide: ${mode[0].toUpperCase()}${mode.slice(1)}`;
    el.style.opacity = "1";
    clearTimeout(el._t);
    el._t = setTimeout(() => (el.style.opacity = "0"), 1200);
  }

  chrome.storage.sync.get("mode", ({ mode = "off" }) => applyMode(mode));

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.mode) {
      applyMode(changes.mode.newValue);
      toast(changes.mode.newValue);
    }
  });
})();
