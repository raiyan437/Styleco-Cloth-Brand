import { z } from "zod";

const environmentSchema = z.object({
  CATALOG_PROVIDER: z.enum(["mock", "appwrite"]).default("mock"),
});

export function parseEnvironment(input: Record<string, string | undefined>) {
  return environmentSchema.parse(input);
}

// Only validate these when implementing/selecting the Appwrite adapter.
export const appwriteEnvironmentSchema = z.object({
  APPWRITE_ENDPOINT: z.url(),
  APPWRITE_PROJECT_ID: z.string().min(1),
  APPWRITE_DATABASE_ID: z.string().min(1),
});
