import { z } from "zod";
export const checkoutSchema = z
  .object({
    email: z.email("Enter a valid email address."),
    phone: z
      .string()
      .regex(
        /^(?:\+?880|0)1[3-9]\d{8}$/,
        "Use a Bangladesh mobile number, e.g. 01712345678.",
      ),
    fullName: z.string().trim().min(2, "Enter your full name.").max(80),
    address: z.string().trim().min(6, "Enter your street address.").max(200),
    city: z.string().trim().min(2, "Enter your city.").max(60),
    postalCode: z.string().regex(/^\d{4}$/, "Enter a 4-digit postal code."),
    delivery: z.enum(["standard", "express"]),
    payment: z.enum(["cod", "card"]),
    cardNumber: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.payment === "card" &&
      !["4242424242424242", "4000000000000002"].includes(
        value.cardNumber?.replaceAll(" ", "") ?? "",
      )
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["cardNumber"],
        message: "Enter a valid card number.",
      });
    }
  });
export type CheckoutValues = z.infer<typeof checkoutSchema>;
