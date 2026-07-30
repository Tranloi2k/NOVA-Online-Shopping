import { getAddresses } from "@/app/lib/services/address";
import AddressesManager from "./addresses-manager";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { buildPageMetadata } from "@/app/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Shipping Addresses",
  description: "Manage your NOVA shipping addresses.",
  pathname: "/account/addresses",
  noIndex: true,
});

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const addresses = await getAddresses();

  return (
    <div className="acct-card">
      <div className="acct-card-head">
        <h3>Shipping Addresses</h3>
      </div>
      <AddressesManager initialAddresses={addresses} />
    </div>
  );
}
