import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;
if (!SECRET) {
  throw new Error("JWT_SECRET no definido en variables de entorno");
}

interface TicketPayload {
  userId: string;
  ticketId: number;
}

export function generateTicketToken(userId: string, ticketId: number) {
  return jwt.sign({ userId, ticketId }, SECRET, { expiresIn: "24h" });
}

export function verifyTicketToken(token: string): TicketPayload {
  return jwt.verify(token, SECRET) as TicketPayload;
}
