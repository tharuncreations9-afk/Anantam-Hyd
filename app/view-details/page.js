import { redirect } from "next/navigation";

export const metadata = {
  title: "Not Found",
  robots: { index: false, follow: false },
};

export default function ViewDetailsPage() {
  redirect("/contact");
}
