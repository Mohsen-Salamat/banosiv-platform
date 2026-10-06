import { requireUser, assertRole } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
import { assertSameOrigin, jsonError } from "@/lib/http";

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    const user = await requireUser();
    assertRole(user, ["ADMIN", "SUPER_ADMIN"]);
    throw new ApiError(501, "REFUND_WORKFLOW_NOT_ENABLED", "Refund execution is preserved in the contract but is not enabled in this Thin Slice.");
  } catch (error) { return jsonError(error, req); }
}
