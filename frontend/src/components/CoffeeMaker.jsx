import React, { useState } from "react";
import "./GameScreen.css";

const ALL_INGREDIENTS = [
  "ช็อตเอสเปรสโซ่",
  "น้ำร้อน",
  "นมสด",
  "ฟองนม",
  "ชาเขียว",
  "ชาดำ",
  "ผงโกโก้",
  "น้ำแข็ง",
  "โซดา",
  "ซอสช็อกโกแลต",
  "ไซรัปคาราเมล",
  "ไซรัปวานิลลา",
  "น้ำส้ม",
  "น้ำยูสุ",
  "น้ำผึ้ง",
  "เค้กช็อกโกแลต",
];

const COLOR_MAP = {
  "ช็อตเอสเปรสโซ่": "#5b341a",
  "น้ำร้อน": "#f5f5f5",
  "นมสด": "#fff5e6",
  "ฟองนม": "#ffffff",
  "ชาเขียว": "#6ee7b7",
  "ชาดำ": "#8b5a2b",
  "ผงโกโก้": "#6b3e26",
  "น้ำแข็ง": "#dbeafe",
  "โซดา": "#e0f2fe",
  "ซอสช็อกโกแลต": "#3b2f2f",
  "ไซรัปคาราเมล": "#d97706",
  "ไซรัปวานิลลา": "#fde68a",
  "น้ำส้ม": "#f97316",
  "น้ำยูสุ": "#fde047",
  "น้ำผึ้ง": "#facc15",
  "เค้กช็อกโกแลต": "#4b2e2e",
};

function CoffeeMaker({ order, onComplete, onCancel }) {
  const [cup, setCup] = useState([]);
  const [message, setMessage] = useState("");

  // 🟡 state สำหรับดูสูตรชั่วคราว
  const [showRecipe, setShowRecipe] = useState(false);

  const targetRecipe = order.order.recipe;

  const addIngredient = (ing) => {
    setCup((prev) => [...prev, ing]);
    setMessage("");
  };

  const handleServe = () => {
    if (cup.length === 0) {
      setMessage("ยังไม่มีส่วนผสมในแก้วเลย");
      return;
    }

    const total = targetRecipe.length;
    let correctCount = 0;
    for (let i = 0; i < total; i++) {
      if (cup[i] === targetRecipe[i]) correctCount++;
    }

    const quality = correctCount / total;
    const success = quality === 1;

    if (!success) {
      setMessage("สูตรไม่ตรง ลูกค้าอาจไม่พอใจ...");
    } else {
      setMessage("");
    }

    onComplete({
      success,
      quality,
      correctCount,
      total,
    });

    setCup([]);
  };

  const handleClear = () => {
    setCup([]);
    setMessage("");
  };

  return (
    <div className="coffee-overlay">
      <div className="coffee-panel">

        {/* ชื่อเมนู */}
        <h3>ทำเมนู: {order.order.name}</h3>

        {/* 🔍 ปุ่มดูสูตร */}
        <button
          className="recipe-hint-btn"
          onClick={() => {
            setShowRecipe(true);
            setTimeout(() => setShowRecipe(false), 5000);
          }}
        >
          👁️ ดูสูตร (จำเอาเอง!)
        </button>

        {/* 📜 สูตร (แสดงชั่วคราว) */}
        {showRecipe && (
          <div className="recipe-hint-box">
            <strong>สูตรเครื่องดื่ม:</strong>
            <ol>
              {targetRecipe.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <small>⏳ สูตรจะแสดงเพียงชั่วคราว</small>
          </div>
        )}

        <p className="coffee-sub">
          ลองเลือกส่วนผสมตามสัญชาตญาณของบาริสต้า แล้วกด “เสิร์ฟ”
        </p>

        <div className="coffee-layout">
          {/* แก้วกาแฟ */}
          <div className="coffee-cup">
            <div className="cup-shape">
              {cup.length === 0 ? (
                <span className="cup-placeholder">แก้วเปล่า</span>
              ) : (
                cup.map((ing, i) => (
                  <div
                    key={i}
                    className="cup-layer"
                    style={{ background: COLOR_MAP[ing] || "#facc92" }}
                  >
                    <span className="cup-layer-label">{ing}</span>
                  </div>
                ))
              )}
            </div>

            <div className="coffee-buttons">
              <button className="secondary-btn" onClick={handleClear}>
                ล้างแก้ว
              </button>
              <button className="primary-btn" onClick={handleServe}>
                ☕ เสิร์ฟ
              </button>
            </div>

            {message && <p className="coffee-message">{message}</p>}
          </div>

          {/* ส่วนผสม */}
          <div className="coffee-ingredients">
            <h4>ส่วนผสม</h4>
            <div className="ingredients-grid">
              {ALL_INGREDIENTS.map((ing) => (
                <button
                  key={ing}
                  className="ingredient-chip"
                  onClick={() => addIngredient(ing)}
                >
                  {ing}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="close-overlay-btn" onClick={onCancel}>
          ✕ ปิดหน้าทำกาแฟ
        </button>
      </div>
    </div>
  );
}

export default CoffeeMaker;
