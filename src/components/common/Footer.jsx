import React from "react";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        <div style={footerSection}>
          <h3 style={{ color: "#2c3e50" }}>LawMate</h3>
          <p>공공데이터 기반 지능형 법률 판례 서비스</p>
        </div>
      </div>

      <div style={copyrightStyle}>
        © 2026 LawMate Project Team. All rights reserved.
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: "#f8f9fa",
  padding: "50px 5% 20px",
  borderTop: "1px solid #eee",
  marginTop: "auto",
};

const footerContentStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "30px",
};

const footerSection = { flex: 1 };

const copyrightStyle = {
  textAlign: "center",
  borderTop: "1px solid #eee",
  paddingTop: "20px",
  fontSize: "12px",
  color: "#999",
};

export default Footer;
