import { redirect } from "next/navigation";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const status = first(params.status);
  const trxID = first(params.trxID);

  const target = new URLSearchParams();
  if (status) target.set("payment", status);
  if (trxID) target.set("trx", trxID);
  const qs = target.toString();

  redirect(qs ? `/tenant/payments?${qs}` : "/tenant/payments");
}
