import { getBerry } from "$api/client";
import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  try {
    const berry = await getBerry(params.name);
    return { berry };
  } catch {
    throw error(404, `Berry "${params.name}" not found`);
  }
};
