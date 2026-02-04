import { auth } from "@/auth";
import { getOpsSummary } from "@/lib/api/analytics";

export default async function OpsDashboardPage() {
  // Auth check: must be ADMIN
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="text-xl font-semibold mb-2">Access denied</div>
        <div className="text-muted-foreground text-sm">
          Admins only.
        </div>
      </div>
    );
  }

  const data = await getOpsSummary(session.user.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Ops Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Marketplace health, last {data.windowDaysGMV} days.
        </p>
      </header>

      {/* KPI STRIP */}
      <section className="grid gap-4 md:grid-cols-4">
        {/* GMV Top City */}
        <CardStat
          label={`Top City GMV (${data.windowDaysGMV}d)`}
          primary={
            data.gmvByCity[0]
              ? `${data.gmvByCity[0].currency} ${data.gmvByCity[0].gmv.toFixed(2)}`
              : "—"
          }
          secondary={
            data.gmvByCity[0]
              ? data.gmvByCity[0].cityLabel
              : "No sales"
          }
        />

        {/* Top Category */}
        <CardStat
          label="Top Category"
          primary={
            data.topCategories[0]
              ? data.topCategories[0].category
              : "—"
          }
          secondary={
            data.topCategories[0]
              ? `GMV ${data.topCategories[0].gmv.toFixed(2)}`
              : ""
          }
        />

        {/* Highest Revenue Seller */}
        <CardStat
          label={`Top Seller (${data.windowDaysGMV}d)`}
          primary={
            data.topSellersByRevenue[0]
              ? (data.topSellersByRevenue[0].shopName ||
                data.topSellersByRevenue[0].handle ||
                "—")
              : "—"
          }
          secondary={
            data.topSellersByRevenue[0]
              ? `${data.topSellersByRevenue[0].netRevenue7d.toFixed(2)} net`
              : ""
          }
        />

        {/* Payout Liability */}
        <CardStat
          label="Payout Liability (unpaid)"
          primary={`${data.payoutLiability.currency} ${data.payoutLiability.totalLiability.toFixed(2)}`}
          secondary="Deliveries completed, not settled"
        />
      </section>

      {/* GMV by City */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">GMV by City (last {data.windowDaysGMV}d)</h2>
        <TableSimple
          headers={["City", "GMV"]}
          rows={data.gmvByCity.map((c: any) => [
            c.cityLabel,
            `${c.currency} ${c.gmv.toFixed(2)}`,
          ])}
        />
      </section>

      {/* Top Categories */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Top Categories (last {data.windowDaysGMV}d)</h2>
        <TableSimple
          headers={["Category", "GMV"]}
          rows={data.topCategories.map((cat: any) => [
            cat.category,
            cat.gmv.toFixed(2),
          ])}
        />
      </section>

      {/* Sellers by Revenue */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Sellers by Revenue (last {data.windowDaysGMV}d)</h2>
        <TableSimple
          headers={[
            "Seller",
            "Handle",
            "City",
            "Net Revenue (7d)",
            "Rating",
          ]}
          rows={data.topSellersByRevenue.map((s: any) => [
            s.shopName || "—",
            s.handle || "—",
            s.city
              ? `${s.city}${s.country ? ", " + s.country : ""}`
              : (s.country || "—"),
            s.netRevenue7d.toFixed(2),
            `${s.ratingAvg.toFixed(1)}★ (${s.ratingCount})`,
          ])}
        />
      </section>

      {/* High Dispute Sellers */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          High Dispute Sellers (last {data.windowDaysDispute}d)
        </h2>
        <p className="text-[11px] text-muted-foreground">
          Sorted by dispute rate. Sellers with many issues need coaching or
          suspension.
        </p>
        <TableSimple
          headers={[
            "Seller",
            "Handle",
            "City",
            "Dispute rate",
            "Sold",
            "Disputes",
          ]}
          rows={data.highDisputeSellers.map((s: any) => [
            s.shopName || "—",
            s.handle || "—",
            s.city
              ? `${s.city}${s.country ? ", " + s.country : ""}`
              : (s.country || "—"),
            `${s.disputeRatePct.toFixed(1)}%`,
            s.sold,
            s.disputes,
          ])}
        />
      </section>

      {/* Outstanding Payout Liability */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Top Sellers Owed Funds</h2>
        <p className="text-[11px] text-muted-foreground">
          {"This is what we owe to sellers for delivered items that haven't been paid out yet."}
        </p>
        <TableSimple
          headers={[
            "Seller",
            "Handle",
            "City",
            "Amount Owed",
          ]}
          rows={data.payoutLiability.topOwed.map((s: any) => [
            s.shopName || "—",
            s.handle || "—",
            s.city
              ? `${s.city}${s.country ? ", " + s.country : ""}`
              : (s.country || "—"),
            `${data.payoutLiability.currency} ${s.amount.toFixed(2)}`,
          ])}
        />
      </section>
    </div>
  );
}

// lightweight stat card
function CardStat({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: string;
  secondary: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-1">
      <div className="text-[11px] text-muted-foreground uppercase font-medium">
        {label}
      </div>
      <div className="text-xl font-semibold">{primary}</div>
      <div className="text-[11px] text-muted-foreground">{secondary}</div>
    </div>
  );
}

// tiny table styling just for ops
function TableSimple({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="text-left text-[11px] text-muted-foreground uppercase">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-xs text-foreground">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-4 text-muted-foreground text-center"
              >
                No data
              </td>
            </tr>
          ) : (
            rows.map((cols, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-background/40" : "bg-background/10"}
              >
                {cols.map((col, j) => (
                  <td
                    key={j}
                    className="px-4 py-2 whitespace-nowrap align-top"
                  >
                    {col}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
