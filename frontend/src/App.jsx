// src/App.jsx
import { useState } from "react";
import "./App.css";
import GameScreen from "./components/GameScreen";

function App() {
  const [start, setStart] = useState(false);

  // ถ้ายังไม่เริ่มเกม แสดงหน้าโฮม
  if (!start) {
    return (
      <div className="home-container fade-in">
        {/* อีโมตกแต่งลอยรอบๆ */}
<div className="decor-icon decor-top-left">
  <img src="/deco-coffee.png" className="decor-img" />
</div>

<div className="decor-icon decor-top-right">
  <img src="/deco-donut.png" className="decor-img" />
</div>

<div className="decor-icon decor-bottom-left">
  <img src="/deco-bubbletea.png" className="decor-img" />
</div>

<div className="decor-icon decor-bottom-right">
  <img src="/deco-cupcake.png" className="decor-img" />
</div>

        <h1 className="home-title">
          ☕ <span>Café Builder</span>
        </h1>

        <div className="home-subtitle">
          เกมจำลองการบริหารร้านกาแฟ
          <br />
          รายวิชา Technology Digital and Innovation (DTI)
        </div>

        <button className="home-btn" onClick={() => setStart(true)}>
          ▶ เริ่มเล่นเกม
        </button>
      </div>
    );
  }

  // ถ้าเริ่มเกมแล้ว แสดงหน้าเกมหลัก
  return <GameScreen goBack={() => setStart(false)} />;
}

export default App;
