import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import { AddToCartClient } from "./AddToCartClient";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const p = await getProduct(params.id).catch(() => null);
  if (!p) return notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 grid md:grid-cols-2 gap-10">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
        <Image
          src={p.imageUrl || "/mock-product.png"}
          alt={p.title}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <h1 className="text-3xl font-semibold">{p.title}</h1>
        <div className="mt-2 text-muted-foreground">{p.description}</div>
        <div className="mt-6 text-2xl font-semibold">
          {p.currency} {Number(p.price).toFixed(2)}
        </div>
        <AddToCartClient id={p.id} />
      </div>
    </div>
  );
}
