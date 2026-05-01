import { currentUser } from '@clerk/nextjs/server';

import { prisma } from '@/lib/prisma';

export async function syncCurrentUser() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error('No email found for the authenticated user.');
  }

  const userData = {
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    imageUrl: user.imageUrl ?? null,
    email,
  };

  return prisma.user.upsert({
    where: {
      clerkId: user.id,
    },
    update: userData,
    create: {
      clerkId: user.id,
      ...userData,
    },
  });
}

export async function getCurrentUserSummary() {
  const user = await currentUser();

  if (!user) {
    return {
      isSignedIn: false,
      clerkId: null,
      dbUser: null,
    };
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      id: true,
      clerkId: true,
      firstName: true,
      lastName: true,
      email: true,
      imageUrl: true,
    },
  });

  return {
    isSignedIn: true,
    clerkId: user.id,
    dbUser,
  };
}
