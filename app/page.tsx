export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#0f172a",
      color: "white",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
        منصة 4You BI
      </h1>

      <p style={{ fontSize: "18px", maxWidth: "600px", opacity: 0.9 }}>
        منصة لتحليل البيانات وعرض مؤشرات الأداء بطريقة ذكية وسهلة
      </p>

      <button style={{
        marginTop: "30px",
        padding: "14px 28px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        background: "#38bdf8",
        color: "#020617"
      }}>
        ابدأ الآن
      </button>
    </main>
  );
}
