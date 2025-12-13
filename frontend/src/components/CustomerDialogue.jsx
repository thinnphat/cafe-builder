import React from "react";
import "./GameScreen.css";

function CustomerDialogue({ dialogue, onClose, onChoice }) {
  if (!dialogue) return null;

  const { name, mood, text, choices } = dialogue;

  const emoji =
    mood === "happy"
      ? "😊"
      : mood === "neutral"
      ? "😐"
      : mood === "angry"
      ? "😠"
      : "🧍";

  const buttons =
    choices && choices.length > 0
      ? choices
      : [{ label: "Okay", value: "ok" }];

  const handleClick = (value) => {
    if (onChoice) onChoice(value);
    else if (onClose) onClose();
  };

  return (
    <div className="dialogue-overlay">
      <div className="dialogue-card">
        <div className="dialogue-header">
          <div className="dialogue-avatar">{emoji}</div>
          <div>
            <div className="dialogue-name">{name}</div>
            <div className="dialogue-mood">
              {mood === "happy"
                ? "ลูกค้าดูพอใจมาก"
                : mood === "neutral"
                ? "ลูกค้ารู้สึกเฉย ๆ"
                : mood === "angry"
                ? "ลูกค้าไม่พอใจ"
                : "อารมณ์ลูกค้าไม่แน่ใจ"}
            </div>
          </div>
        </div>

        <div className="dialogue-bubble">
          <p>{text}</p>
        </div>

        <div className="dialogue-actions">
          {buttons.map((btn, index) => (
            <button
              key={btn.value || index}
              className={index === 0 ? "primary-btn" : "secondary-btn"}
              onClick={() => handleClick(btn.value)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerDialogue;
