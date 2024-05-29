import client from "../db/client";

export async function listPatterns() {
  return client.from("patterns").select();
}
