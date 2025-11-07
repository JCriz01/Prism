import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ServerIdPageProps {
  params: Promise<{ serverId: string }>;
}

export default async function ServerIdPage({ params }: ServerIdPageProps) {
  const profile = await currentProfile();

  const { serverId } = await params;
  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  console.log(server);

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") return null;

  return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`);
}
