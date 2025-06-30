interface PaymentLinkEmailProps {
  name: string;
  paymentLink: string;
}

export const PaymentLinkEmail = ({
  name,
  paymentLink,
}: PaymentLinkEmailProps) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f9f9f9",
      padding: "32px",
      borderRadius: "8px",
      maxWidth: "600px",
      margin: "0 auto",
    }}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="https://i.imgur.com/eeQqWHp.png"
      alt="Logo de la conferencia"
      style={{ width: "120px", marginBottom: "24px" }}
    />

    <h2 style={{ color: "#333" }}>🎉 ¡Gracias por registrarte, {name}!</h2>
    <p style={{ color: "#555", fontSize: "16px", lineHeight: "1.6" }}>
      Estamos encantados de que formes parte de nuestra conferencia. Para
      completar tu registro, por favor realiza tu pago haciendo clic en el botón
      a continuación:
    </p>
    <div style={{ marginTop: "24px", textAlign: "center" }}>
      <a
        href={paymentLink}
        style={{
          backgroundColor: "#0070f3",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "6px",
          textDecoration: "none",
          fontSize: "16px",
          display: "inline-block",
        }}
      >
        💳 Pagar entrada
      </a>
    </div>
    <p style={{ color: "#888", fontSize: "14px", marginTop: "24px" }}>
      Si el botón no funciona, también puedes copiar y pegar este enlace en tu
      navegador:
    </p>
    <p style={{ color: "#555", wordBreak: "break-word" }}>{paymentLink}</p>
    <p style={{ color: "#999", fontSize: "12px", marginTop: "32px" }}>
      Este mensaje fue enviado automáticamente. Por favor, no respondas a este
      correo.
    </p>
  </div>
);
