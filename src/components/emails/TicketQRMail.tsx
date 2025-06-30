import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Text,
} from "@react-email/components";

interface TicketEmailProps {
  name: string;
  qrImageUrl: string;
}

export const TicketQRMail = ({ name, qrImageUrl }: TicketEmailProps) => (
  <Html>
    <Head />
    <Preview>Tu ticket para la conferencia</Preview>
    <Body
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Container
        style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "8px",
          maxWidth: "480px",
          margin: "0 auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <Img
          src="https://upload.wikimedia.org/wikipedia/commons/3/30/Redux_Logo.png"
          alt="Logo"
          width="80"
          style={{
            marginBottom: "20px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />

        <Text style={{ fontSize: "18px", fontWeight: "bold" }}>
          Hola {name},
        </Text>

        <Text>
          Gracias por tu compra. Este es tu ticket para la conferencia:
        </Text>

        <div
          style={{
            display: "inline-block",
            padding: "10px",
            border: "2px solid #e0e0e0",
            borderRadius: "12px",
            margin: "20px 0",
            backgroundColor: "#fafafa",
          }}
        >
          <Img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
              qrImageUrl,
            )}&size=200x200`}
            alt="QR del ticket"
            width="200"
            height="200"
          />
        </div>

        <Text style={{ fontSize: "14px", color: "#555" }}>
          Muestra este QR en la entrada del evento.
        </Text>

        <Text style={{ marginTop: "30px" }}>¡Nos vemos pronto! 👋</Text>
      </Container>
    </Body>
  </Html>
);
