import UserList from "@/components/dashboard/users/UserList";
import { prisma } from "@/lib/prisma";
import { UserWithTicket } from "@/types/UserType";
import { redirect } from "next/navigation";

const PAGE_SIZE = 10;

interface UsersContainerProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UsersContainer({
  searchParams,
}: UsersContainerProps) {
  // Await searchParams antes de usar sus propiedades
  const params = await searchParams;

  const page = Number(params?.page || 1);
  const status = Array.isArray(params?.status)
    ? params.status[0]
    : params?.status || "all";
  const checkin = Array.isArray(params?.checkin)
    ? params.checkin[0]
    : params?.checkin || "all";
  const query = Array.isArray(params?.q)
    ? params.q[0]?.toLowerCase() || ""
    : params?.q?.toLowerCase() || "";

  if (isNaN(page) || page < 1) redirect("/dashboard/users?page=1");

  const skip = (page - 1) * PAGE_SIZE;

  // Ejecutar ambas queries en paralelo
  const [usersWithTicket, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [{ name: { contains: query } }, { email: { contains: query } }],
          },
          status === "all"
            ? {}
            : {
                Ticket: {
                  paid: status === "paid",
                },
              },
          checkin === "all"
            ? {}
            : {
                Ticket: {
                  checkedIn: checkin === "checked",
                },
              },
        ],
      },
      include: {
        Ticket: true,
      },
      skip,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count({
      where: {
        AND: [
          {
            OR: [{ name: { contains: query } }, { email: { contains: query } }],
          },
          status === "all"
            ? {}
            : {
                Ticket: {
                  paid: status === "paid",
                },
              },
          checkin === "all"
            ? {}
            : {
                Ticket: {
                  checkedIn: checkin === "checked",
                },
              },
        ],
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const mappedUsers: UserWithTicket[] = usersWithTicket.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    ticketStatus: user.Ticket?.paid ? "paid" : "pending",
    checkInStatus: user.Ticket?.checkedIn ? "checked" : "pending",
    purchaseDate: user.Ticket?.createdAt?.toISOString() ?? "",
    ticketId: user.Ticket?.id ?? null,
  }));

  return (
    <UserList
      users={mappedUsers}
      pagination={{
        page,
        totalPages,
      }}
      filters={{
        name: query,
        status,
        checkin,
      }}
    />
  );
}
