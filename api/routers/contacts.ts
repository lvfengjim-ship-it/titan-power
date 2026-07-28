import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { createContact } from "../queries/contacts";

export const contactsRouter = createRouter({
  submit: publicQuery
    .input(z.object({
      name: z.string().min(1).max(128),
      org: z.string().max(255).optional().default(""),
      phone: z.string().max(64).optional().default(""),
      email: z.string().max(255).optional().default(""),
      type: z.string().max(64).optional().default("other"),
      message: z.string().max(4000).optional().default(""),
      source: z.string().max(64).optional().default("contact"),
    }))
    .mutation(({ input }) => createContact(input)),
});
