import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const store = await cookies();
  store.delete("accessToken");
  store.delete("refreshToken");
  revalidatePath("/", "layout");
  return NextResponse.redirect(new URL("/login", request.url));
}
