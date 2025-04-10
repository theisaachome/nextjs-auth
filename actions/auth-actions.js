"use server";

import { createAuthSession } from "@/lib/auth";
import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signup(prevState,formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors={};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }
  if (password.trim().length < 8 ) {
    errors.password = "Password must be at least 8 characters long";
  }

  if(Object.keys(errors).length > 0) {
    return {
      errors
    }

  }
  const hashedPassword = hashUserPassword(password);
  try {
    // save user to database
    const id = await createUser(email, hashedPassword);
    createAuthSession(id);
    redirect("/training");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      // Unique constraint violation
      return {
        errors: {
          email: "It seems like account for the chosen  email already exists!"
        }
      }
    }
    throw error; // nextjs default error handler will kick  off
    
  }
}