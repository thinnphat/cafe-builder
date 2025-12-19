import React, { useState, useEffect } from "react";
import "./GameScreen.css";
import CoffeeMaker from "./CoffeeMaker";
import CustomerDialogue from "./CustomerDialogue";

function GameScreen({ goBack }) {
  const [money, setMoney] = useState(100);
  const [customers, setCustomers] = useState([]);
  const [decorations, setDecorations] = useState([]);
  const [dialogue, setDialogue] = useState(null);

  const [decorationScore, setDecorationScore] = useState(0);
  const [activeOrder, setActiveOrder] = useState(null);

  // ⭐ เรทติ้งร้าน (เริ่มจาก 0)
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  // 🟣 ระบบวัน (Day System)
  const [day, setDay] = useState(1);
  const DAY_DURATION = 60; // 1 วัน = 60 วินาที
  const [timeLeft, setTimeLeft] = useState(DAY_DURATION);

  // เมนู + สูตรกาแฟ
  const menu = [
    { name: "เอสเปรสโซ่", price: 40, recipe: ["ช็อตเอสเปรสโซ่"], unlockDay: 1 },
    { name: "ลาเต้", price: 50, recipe: ["ช็อตเอสเปรสโซ่", "นมสด", "ฟองนม"], unlockDay: 2 },
    { name: "ชาเขียวเย็น", price: 45, recipe: ["ชาเขียว", "นมสด", "น้ำแข็ง"], unlockDay: 3 },
    { name: "มอคค่า", price: 55, recipe: ["ช็อตเอสเปรสโซ่", "นมสด", "ซอสช็อกโกแลต", "ฟองนม"], unlockDay: 4 },
    { name: "เค้กช็อกโกแลต", price: 60, recipe: ["เค้กช็อกโกแลต"], unlockDay: 5 },
  ];

  // ร้านขายของตกแต่ง
  const decorationShop = [
    { name: "โต๊ะกาแฟไม้", price: 80, attract: 1, type: "seat" },
    { name: "แจกันดอกไม้", price: 40, attract: 0.5, type: "beauty" },
    { name: "โคมไฟวินเทจ", price: 70, attract: 0.8, type: "bonus_money" },
  ];

  // 🟣 ตัวจับเวลา (Day Timer)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setDay((d) => d + 1);
          return DAY_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, []);

  // 🟣 สุ่มลูกค้าเข้าร้าน (วันสูงขึ้น = เข้าถี่ขึ้น)
  useEffect(() => {
    const baseDelay = 7000;

    const decoBonus = Math.min(decorationScore * 500, 5000);
    const dayBonus = Math.min((day - 1) * 700, 4000);

    const delay = Math.max(1800, baseDelay - decoBonus - dayBonus);

    const interval = setInterval(() => {
      const availableMenu = menu.filter((item) => day >= item.unlockDay);
      const randomOrder =
        availableMenu[Math.floor(Math.random() * availableMenu.length)];

      const newCustomer = {
        id: Date.now(),
        name: "ลูกค้า #" + (customers.length + 1),
        order: randomOrder,
      };

      setCustomers((prev) => [...prev, newCustomer]);
    }, delay);

    return () => clearInterval(interval);
  }, [customers.length, decorationScore, day]); // ใช้โค้ดแบบเดิมของคุณได้เลย

  // ผลลัพธ์ตอนเสิร์ฟ
  const handleServeResult = (result) => {
    if (!activeOrder) return;

    const customer = activeOrder;
    const price = customer.order.price;
    const { success, quality } = result;

    setCustomers((prev) => prev.filter((c) => c.id !== customer.id));

    const hasBonusMoney = decorations.some((d) => d.type === "bonus_money");
    const bonusMoney = hasBonusMoney ? 5 : 0;

    if (success) {
      setMoney((prev) => prev + price + bonusMoney);
      setRating((prev) => Math.min(5, prev + 0.15));
      setRatingCount((prev) => prev + 1);

      const happyMessages = [
        "อร่อยมากเลย! แบบนี้แหละที่อยากดื่ม ☕✨",
        "รสชาติดีสุด ๆ จะกลับมาอีกแน่นอน!",
        "ทำดีมาก วันนี้ฟินไปทั้งวันเลย 😄",
        "กำลังพอดีเลย ขอบคุณนะ!",
      ];
      const text = happyMessages[Math.floor(Math.random() * happyMessages.length)];

      setDialogue({
        name: customer.name,
        mood: "happy",
        text,
        choices: [
          { label: "ขอบคุณค่ะ/ครับ", value: "ok" },
          { label: "ไว้แวะมาใหม่นะ", value: "bye" },
        ],
      });
    } else {
      const penaltyBase = Math.round(price * 0.5);
      const penalty = Math.max(10, penaltyBase);
      setMoney((prev) => Math.max(0, prev - penalty));

      // ❗ แก้ตรงนี้: ลดได้ถึง 0 (ไม่เด้งเป็น 1)
      const drop = quality >= 0.5 ? 0.2 : 0.4;
      setRating((prev) => Math.max(0, prev - drop));
      setRatingCount((prev) => prev + 1);

      const mood = quality >= 0.5 ? "neutral" : "angry";

      const neutralMessages = [
        "รสชาติเหมือนจะใช่ แต่ยังไม่ค่อยลงตัวแฮะ…",
        "พอดื่มได้อยู่ แต่ยังไม่ถูกใจเท่าไหร่",
        "เกือบแล้ว ลองปรับอีกนิดน่าจะดีขึ้นนะ",
      ];
      const angryMessages = [
        "นี่มันไม่ใช่เมนูที่ฉันสั่งเลยนะ…",
        "รสชาติแปลกมาก ไม่น่าจะเป็นแบบนี้",
        "ผิดสูตรไปเยอะเลยนะ คราวหน้าช่วยตั้งใจหน่อยนะ!",
      ];

      const pool = mood === "neutral" ? neutralMessages : angryMessages;
      const text = pool[Math.floor(Math.random() * pool.length)];

      setDialogue({
        name: customer.name,
        mood,
        text,
        choices: [
          { label: "ขอโทษด้วยนะ", value: "apologize" },
          { label: "เอาใหม่ครั้งหน้า", value: "next_time" },
        ],
      });
    }

    setActiveOrder(null);
  };

  // ซื้อของตกแต่ง
  const buyDecoration = (item) => {
    if (money < item.price) {
      alert("เงินไม่พอซื้อของตกแต่งชิ้นนี้");
      return;
    }
    setMoney((prev) => prev - item.price);
    setDecorations((prev) => [...prev, item]);
    setDecorationScore((prev) => prev + (item.attract || 0));
  };

  const handleDialogueChoice = () => setDialogue(null);

  return (
    <div className="game-root">
      <div className="game-wrapper">
        <header className="top-bar">
          <div className="top-left">
            <div className="avatar-circle">🧑‍🍳</div>
            <div className="title-block">
              <h1>Café Builder</h1>
              <span>เกมจำลองการบริหารร้านกาแฟ</span>
            </div>
          </div>

          <div className="top-center">
            <span className="money-label">💰 เงินในร้าน</span>
            <span className="money-value">{money} บาท</span>

            <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>
              ✨ ความสวยงามร้าน: {decorationScore.toFixed(1)}
            </div>

            <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>
              ⭐ เรทติ้งร้าน: {rating.toFixed(1)} / 5.0 ({ratingCount} รีวิว)
            </div>

            <div style={{ fontSize: 13, color: "#222", marginTop: 4 }}>
              📅 Day <b>{day}</b> | ⏱ เหลือเวลา <b>{timeLeft}</b> วินาที
            </div>
          </div>

          <button className="back-btn" onClick={goBack}>
            ← กลับไปหน้าหลัก
          </button>
        </header>

        <main className="main-layout">
          <section className="play-area">
            <div className="play-header">
              <span>พื้นที่ร้านกาแฟ</span>
            </div>
            <div className="play-body">
              {customers.length === 0 ? (
                <div className="play-empty">ยังไม่มีลูกค้า ร้านเงียบอยู่… ☕</div>
              ) : (
                <div className="customer-preview">🧍‍♀️ มีลูกค้าอยู่หน้าร้าน {customers.length} คน</div>
              )}
            </div>
          </section>

          <section className="side-panel">
            <div className="panel">
              <div className="panel-header">
                <span>🧍 ลูกค้าที่รอเสิร์ฟ</span>
              </div>
              <div className="panel-body">
                {customers.length === 0 ? (
                  <p className="hint-text">ระบบจะสุ่มลูกค้าเข้าร้านให้โดยอัตโนมัติ</p>
                ) : (
                  customers.map((c) => (
                    <div className="customer-row" key={c.id}>
                      <div className="customer-info">
                        <div className="customer-name">{c.name}</div>
                        <div className="customer-order">
                          สั่ง: <strong>{c.order.name}</strong> ({c.order.price} บาท)
                        </div>
                      </div>
                      <button className="primary-btn" onClick={() => setActiveOrder(c)}>
                        ทำกาแฟ
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <span>📜 เมนูเครื่องดื่ม/ขนม</span>
              </div>
              <div className="panel-body menu-list">
                {menu
                  .filter((item) => day >= item.unlockDay)
                  .map((item, index) => (
                    <div className="menu-row" key={index}>
                      <div>
                        {item.name}
                        <div className="menu-price">{item.price} บาท</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <span>🎨 ร้านขายของตกแต่ง</span>
              </div>
              <div className="panel-body shop-list">
                {decorationShop.map((item, index) => (
                  <div className="shop-row" key={index}>
                    <div>
                      {item.name}
                      <div className="menu-price">{item.price} บาท</div>
                    </div>
                    <button className="secondary-btn" onClick={() => buyDecoration(item)}>
                      ซื้อ
                    </button>
                  </div>
                ))}
              </div>

              <div className="panel-footer">
                <span>ของตกแต่งที่มีในร้าน:</span>
                {decorations.length === 0 ? (
                  <p className="hint-text">ยังไม่ได้ซื้อของตกแต่ง</p>
                ) : (
                  <ul className="deco-list">
                    {decorations.map((d, i) => (
                      <li key={i}>{d.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        </main>

        {activeOrder && (
          <CoffeeMaker
            order={activeOrder}
            onComplete={handleServeResult}
            onCancel={() => setActiveOrder(null)}
          />
        )}

        {dialogue && (
          <CustomerDialogue
            dialogue={dialogue}
            onClose={() => setDialogue(null)}
            onChoice={handleDialogueChoice}
          />
        )}
      </div>
    </div>
  );
}

export default GameScreen;
