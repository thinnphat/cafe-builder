import React, { useState } from "react";
import "./GameScreen.css";

const ALL_INGREDIENTS = [
  "ช็อตเอสเปรสโซ่",
  "นมสด",
  "ฟองนม",
  "น้ำแข็ง",
  "ชาเขียว",
  "ซอสช็อกโกแลต",
  "เค้กช็อกโกแลต",
];

const COLOR_MAP = {
  "ช็อตเอสเปรสโซ่": "#5b341a",
  "นมสด": "#fff5e6",
  "ฟองนม": "#ffffff",
  "น้ำแข็ง": "#dbeafe",
  "ชาเขียว": "#6ee7b7",
  "ซอสช็อกโกแลต": "#3b2f2f",
  "เค้กช็อกโกแลต": "#4b2e2e",
};

function CoffeeMaker({ order, onComplete, onCancel }) {
  const [cup, setCup] = useState([]);
  const [message, setMessage] = useState("");

  const targetRecipe = order.order.recipe;

  // เลือกส่วนผสม (ไม่เช็คทีละขั้นแล้ว ปล่อยให้เดาเอง)
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

    if (onComplete) {
      onComplete({
        success,
        quality,
        correctCount,
        total,
      });
    }
    setCup([]);
  };

  const handleClear = () => {
    setCup([]);
    setMessage("");
  };

  return (
    <div className="coffee-overlay">
      <div className="coffee-panel">
        <h3>ทำเมนู: {order.order.name}</h3>
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
                    style={{
                      background: COLOR_MAP[ing] || "#facc92",
                    }}
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

          {/* ส่วนผสมให้เลือก */}
          <div className="coffee-ingredients">
            <h4>ส่วนผสม</h4>
            {/* ไม่โชว์สูตรแล้ว ปล่อยให้เดาเอง */}
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
