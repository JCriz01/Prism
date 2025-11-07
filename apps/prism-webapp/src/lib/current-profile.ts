import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const currentProfile = async () => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  const profile = await db.profile.findUnique({
    where: { userId },
  });

  return profile;
};
