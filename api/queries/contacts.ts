import { getDb } from "./connection";
import { contacts } from "@db/schema";

export async function createContact(c: {
  name: string;
  org: string;
  phone: string;
  email: string;
  type: string;
  message: string;
  source: string;
}) {
  const db = getDb();
  await db.insert(contacts).values(c);
  return { ok: true };
}
