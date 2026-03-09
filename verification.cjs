var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// verification.js
var import_react2 = __toESM(require("react"), 1);
var import_server = require("react-dom/server");

// src/app/components/kwil/KwilChip.tsx
var import_react = __toESM(require("react"), 1);
function KwilChip({
  children,
  variant = "primary",
  icon,
  onRemove,
  onClick,
  className = ""
}) {
  const variants = {
    primary: "bg-[#00FF9C]/20 text-[#00FF9C] border-[#00FF9C]/40",
    secondary: "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40",
    outline: "bg-transparent text-[#FFFFFF] border-white/30"
  };
  const handleKeyDown = (e) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };
  return /* @__PURE__ */ import_react.default.createElement(
    "div",
    {
      onClick,
      onKeyDown: handleKeyDown,
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      className: `
        inline-flex items-center gap-2
        px-4 py-2
        rounded-full
        border
        text-sm
        transition-all duration-200
        ${variants[variant]}
        ${onClick ? "hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9C]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]" : ""}
        ${className}
      `
    },
    icon && /* @__PURE__ */ import_react.default.createElement("span", { className: "text-current" }, icon),
    /* @__PURE__ */ import_react.default.createElement("span", null, children),
    onRemove && /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        onClick: (e) => {
          e.stopPropagation();
          onRemove();
        },
        "aria-label": typeof children === "string" ? `Remove ${children}` : "Remove item",
        className: "ml-1 text-current hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-full leading-none p-0.5"
      },
      "\xD7"
    )
  );
}

// verification.js
var import_fs = __toESM(require("fs"), 1);
var html = (0, import_server.renderToString)(
  import_react2.default.createElement(
    "div",
    { style: { padding: "20px", backgroundColor: "#050B08", display: "flex", gap: "10px" } },
    import_react2.default.createElement(KwilChip, null, "Static Chip"),
    import_react2.default.createElement(KwilChip, { onClick: () => {
    }, onRemove: () => {
    } }, "Interactive Chip")
  )
);
var fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Mimic some tailwind variants not supported by default CDN */
    .focus-visible\\:ring-2:focus-visible { box-shadow: 0 0 0 2px var(--tw-ring-color); }
    .focus-visible\\:ring-\\[\\#00FF9C\\]\\/50:focus-visible { --tw-ring-color: rgba(0, 255, 156, 0.5); }
    .focus-visible\\:ring-offset-2:focus-visible { box-shadow: 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color), 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); }
    .focus-visible\\:ring-offset-\\[\\#050B08\\]:focus-visible { --tw-ring-offset-color: #050B08; --tw-ring-offset-width: 2px; }
    .focus-visible\\:outline-none:focus-visible { outline: 2px solid transparent; outline-offset: 2px; }

    /* Simulate browser focus for screenshot */
    .simulated-focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color), 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
        --tw-ring-color: rgba(0, 255, 156, 0.5);
        --tw-ring-offset-color: #050B08;
        --tw-ring-offset-width: 2px;
    }
  </style>
</head>
<body style="background-color: #050B08; height: 100vh; display: flex; align-items: center; justify-content: center;">
  ${html}
  <script>
    // Add simulated focus class for screenshot purposes
    setTimeout(() => {
        const btn = document.querySelector('[role="button"]');
        if (btn) btn.classList.add('simulated-focus');
    }, 100);
  </script>
</body>
</html>
`;
import_fs.default.writeFileSync("/home/jules/verification/test.html", fullHtml);
