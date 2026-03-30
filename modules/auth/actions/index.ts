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

    const userData = {
      firstName: firstName ?? null,
      lastName: lastName ?? null,
      imageUrl: imageUrl ?? null,
      email,
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: id
      },
      select: {
        id: true,
        clerkId: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        email: true,
      }
    });

    if (!existingUser) {
      const createdUser = await prisma.user.create({
        data: {
          clerkId: id,
          ...userData,
        }
      });

      return {
        success: true,
        user: createdUser
      };
    }

    const needsUpdate =
      existingUser.firstName !== userData.firstName ||
      existingUser.lastName !== userData.lastName ||
      existingUser.imageUrl !== userData.imageUrl ||
      existingUser.email !== userData.email;

    if (!needsUpdate) {
      return {
        success: true,
        user: existingUser
      };
    }

    const updatedUser = await prisma.user.update({
      where: {
        clerkId: id
      },
      data: userData
    });

    return {
      success: true,
      user: updatedUser
    };

  } catch (error) {
    console.error("User onboarding error:", error);

    return {
      success: false,
      error: "User onboarding failed"
    };
  }
};
