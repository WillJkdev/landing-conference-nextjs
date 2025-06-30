import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface SpeakerCardProps {
  name: string;
  role: string;
  topic: string;
  image: string;
  company: string;
}

export default function SpeakerCard({
  name,
  role,
  topic,
  image,
  company,
}: SpeakerCardProps) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative w-full h-64">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute top-4 left-4 bg-white/90 text-gray-900">
          {topic}
        </Badge>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-blue-600 font-medium mb-1">{role}</p>
        <p className="text-gray-600 text-sm">{company}</p>
      </CardContent>
    </Card>
  );
}
