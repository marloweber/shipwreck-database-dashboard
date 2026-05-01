import { getSortedShipwrecks, getFilteredShipwrecks } from "@/lib/db";
import DashboardClient from "./DashboardClient";

type PageProps = {
  searchParams: Promise<{ sortBy?: string; [key: string]: string | undefined }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const sortBy = resolvedSearchParams.sortBy || "ship_name";

  const name = resolvedSearchParams.ship_name;
  const yearStart = resolvedSearchParams.year_start ? Number(resolvedSearchParams.year_start) : undefined;
  const yearEnd = resolvedSearchParams.year_end ? Number(resolvedSearchParams.year_end) : undefined;

  const sortedShipwrecks = await getSortedShipwrecks(sortBy);
  const filteredShipwrecks = await getFilteredShipwrecks(name, yearStart, yearEnd)

  const filteredIds = new Set(filteredShipwrecks.map((s) => s.id));
  const shipwrecks = sortedShipwrecks.filter((s) => filteredIds.has(s.id));

  return <DashboardClient shipwrecks={shipwrecks} />;
}