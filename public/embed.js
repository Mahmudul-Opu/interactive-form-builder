(function () {
  "use strict";

  var script = document.currentScript;

  if (!script) {
    console.error("FormFlow: Unable to locate embed script.");
    return;
  }

  var formSlug = script.getAttribute("data-form");

  if (!formSlug) {
    console.error("FormFlow: Missing data-form attribute.");
    return;
  }

  if (!/^[a-zA-Z0-9-]+$/.test(formSlug)) {
    console.error("FormFlow: Invalid form identifier.");
    return;
  }

  var scriptUrl = new URL(script.src);
  var baseUrl = scriptUrl.origin;

  var root = document.createElement("div");
  root.id = "formflow-widget-" + formSlug;

  var shadow = root.attachShadow({ mode: "open" });

  var style = document.createElement("style");

  style.textContent = `
    * {
      box-sizing: border-box;
    }

    .formflow-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 64px;
      height: 64px;
      border: none;
      border-radius: 50%;
      background: #6366f1;
      color: white;
      font-size: 28px;
      cursor: pointer;
      box-shadow: 0 8px 30px rgba(99,102,241,0.4);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .formflow-button:hover {
      background: #4f46e5;
    }

    .formflow-container {
      display: none;
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 380px;
      height: 560px;
      max-height: calc(100dvh - 120px);
      background: white;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 10px 50px rgba(0,0,0,0.2);
      z-index: 2147483646;
    }

    .formflow-container.open {
      display: block;
    }

    .formflow-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    @media (max-width: 480px) {
      .formflow-button {
        bottom: 16px;
        right: 16px;
        width: 56px;
        height: 56px;
      }

      .formflow-container {
        bottom: 85px;
        right: 10px;
        left: 10px;
        width: auto;
        height: calc(100dvh - 105px);
        max-height: 650px;
      }
    }
  `;

  var button = document.createElement("button");
  button.className = "formflow-button";
  button.type = "button";
  button.textContent = "💬";
  button.setAttribute("aria-label", "Open chatbot");
  button.setAttribute("aria-expanded", "false");

  var container = document.createElement("div");
  container.className = "formflow-container";

  var iframe = document.createElement("iframe");
  iframe.className = "formflow-iframe";
  iframe.title = "FormFlow Chatbot";
  iframe.setAttribute("loading", "lazy");
  iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");

  iframe.src =
    baseUrl + "/embed/" + encodeURIComponent(formSlug);

  container.appendChild(iframe);

  button.addEventListener("click", function () {
    var isOpen = container.classList.toggle("open");

    button.textContent = isOpen ? "✕" : "💬";

    button.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );

    button.setAttribute(
      "aria-label",
      isOpen ? "Close chatbot" : "Open chatbot"
    );
  });

  shadow.appendChild(style);
  shadow.appendChild(container);
  shadow.appendChild(button);

  document.body.appendChild(root);
})();