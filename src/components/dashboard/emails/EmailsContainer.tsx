import { redirect } from "next/navigation";
import EmailList from "@/components/dashboard/emails/EmailList";

const PAGE_SIZE = 10;

type Email = {
  id: string;
  recipient: string;
  recipientName: string;
  subject: string;
  status: string;
  sentDate: string;
  deliveredDate: string | null;
  type: string;
  ticketId: number | null;
  attempts: number;
};

interface EmailsContainerProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmailsContainer({
  searchParams,
}: EmailsContainerProps) {
  // Await searchParams antes de usar sus propiedades
  const params = await searchParams;

  const page = Number(params?.page || 1);
  const status = Array.isArray(params?.status)
    ? params.status[0]
    : params?.status || "all";
  const type = Array.isArray(params?.type)
    ? params.type[0]
    : params?.type || "all";
  const query = Array.isArray(params?.q)
    ? params.q[0]?.toLowerCase() || ""
    : params?.q?.toLowerCase() || "";

  if (isNaN(page) || page < 1) redirect("/dashboard/emails?page=1");

  const skip = (page - 1) * PAGE_SIZE;

  try {
    // Fetch emails from API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/resend-emails`,
      {
        next: { revalidate: 0 }, // No cache para datos en tiempo real
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.data)) {
      throw new Error(data.error || "No se pudo obtener los emails.");
    }

    const allEmails: Email[] = data.data;

    // Aplicar filtros
    const filteredEmails = allEmails.filter((email) => {
      const matchesSearch =
        email.recipient.toLowerCase().includes(query) ||
        email.recipientName.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query);
      
      const matchesStatus = status === "all" || email.status === status;
      const matchesType = type === "all" || email.type === type;

      return matchesSearch && matchesStatus && matchesType;
    });

    // Aplicar paginación
    const paginatedEmails = filteredEmails.slice(skip, skip + PAGE_SIZE);
    const totalCount = filteredEmails.length;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    // Calcular estadísticas
    const stats = {
      total: allEmails.length,
      delivered: allEmails.filter((e) => e.status === "delivered").length,
      failed: allEmails.filter((e) => e.status === "failed").length,
      pending: allEmails.filter((e) => e.status === "pending").length,
    };

    return (
      <EmailList
        emails={paginatedEmails}
        stats={stats}
        pagination={{
          page,
          totalPages,
        }}
        filters={{
          query,
          status,
          type,
        }}
        totalFiltered={totalCount}
      />
    );
  } catch (error) {
    console.error("Error fetching emails:", error);
    
    // Retornar componente con error
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        {error instanceof Error ? error.message : "Error al cargar los emails"}
      </div>
    );
  }
}