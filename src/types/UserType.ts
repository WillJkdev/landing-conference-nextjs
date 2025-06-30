export type UserWithTicket = {
  id: string;
  name: string;
  email: string;
  phone: string;
  ticketStatus: "paid" | "pending";
  checkInStatus: "checked" | "pending";
  purchaseDate: string;
  ticketId: number | null;
};
