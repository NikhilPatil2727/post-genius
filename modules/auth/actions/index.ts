"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

export const onboardUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No authenticated user" };
    }

    const { id, firstName, lastName, imageUrl, emailAddresses } = user;

    const email = emailAddresses[0]?.emailAddress;

    if (!email) {
      return { success: false, error: "No email found" };
    }

    const existingUser = await prisma.user.upsert({
      where: {
        clerkId: id
      },
      update: {
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        imageUrl: imageUrl ?? null,
        email: email
      },
      create: {
        clerkId: id,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        imageUrl: imageUrl ?? null,
        email: email
      }
    });

    return {
      success: true,
      user: existingUser
    };

  } catch (error) {
    console.error("User onboarding error:", error);

    return {
      success: false,
      error: "User onboarding failed"
    };
  }
};