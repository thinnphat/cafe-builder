import React from "react";
import "./GameScreen.css";

function DecorationShop({ money, decorations, setDecorations, setMoney }) {
  const items = [
    { id: 1, name: "โต๊ะไม้โอ๊ค", price: 100, attract: 1 },
    { id: 2, name: "แจกันดอกไม้", price: 50, attract: 0.5 },
    { id: 3, name: "รูปภาพกาแฟ", price: 80, attract: 0.8 },
  ];

  const buyItem = (item) => {
    if (money >= item.price) {
      setMoney((prev) => prev - item.price);
      setDecorations((prev) => [...prev, item]);
      alert(`คุณซื้อ ${item.name} สำเร็จแล้ว! 🌿`);
    } else {
      alert("เงินไม่พอที่จะซื้อชิ้นนี้ 😢");
    }
  };

  return (
    <div className="shop-container">
      <h2>🛍️ ร้านขายของตกแต่งร้านกาแฟ</h2>
      <div className="shop-items">
        {items.map((item) => (
          <div key={item.id} className="shop-item">
            <p>{item.name}</p>
            <p>ราคา: {item.price} บาท</p>
            <p>เพิ่มความสวยงาม: +{item.attract}</p>
            <button onClick={() => buyItem(item)}>ซื้อเลย</button>
          </div>
        ))}
      </div>

      <h3>ของตกแต่งที่คุณมี:</h3>
      {decorations.length === 0 ? (
        <p>ยังไม่มีของตกแต่ง</p>
      ) : (
        <ul>
          {decorations.map((d, i) => (
            <li key={i}>{d.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DecorationShop;
