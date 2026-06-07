import { getUser } from "@/app/lib/services/user";
import ProfileForm from "./profile-form";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { buildPageMetadata } from "@/app/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Profile Settings",
  description: "Manage your NOVA profile information.",
  pathname: "/account/profile",
  noIndex: true,
});

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="acct-card">
      <div className="acct-card-head">
        <h3>Profile Settings</h3>
      </div>
      <ProfileForm initialUser={user} />
    </div>
  );
}
