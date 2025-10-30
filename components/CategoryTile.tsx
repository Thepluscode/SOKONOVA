"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function CategoryTile({
  title,
  href,
  avatars = [],
  subtitle,
  delay = 0,
}: {
  title: string;
  href: string;
  avatars?: { id: string; shopLogoUrl?: string | null }[];
  subtitle?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
    >
      <Link
        href={href}
        className="group block rounded-2xl border border-border bg-card p-4 hover:shadow-card active:scale-[.99] focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold group-hover:text-primary transition-colors">{title}</div>
            {subtitle ? (
              <div className="text-[11px] text-muted-foreground">{subtitle}</div>
            ) : null}
          </div>
          <span className="text-muted-foreground transition group-hover:text-foreground">→</span>
        </div>

        {avatars.length > 0 && (
          <div className="mt-3 flex -space-x-3">
            {avatars.slice(0, 4).map((s) => (
              <div
                key={s.id}
                className="relative w-9 h-9 rounded-full border border-border bg-background overflow-hidden"
              >
                {s.shopLogoUrl ? (
                  <Image
                    src={s.shopLogoUrl}
                    alt="seller logo"
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full text-[10px] text-muted-foreground grid place-items-center font-medium">
                    SN
                  </div>
                )}
              </div>
            ))}
            {avatars.length > 4 && (
              <div className="relative w-9 h-9 rounded-full border border-border bg-muted grid place-items-center">
                <span className="text-[10px] font-medium text-muted-foreground">
                  +{avatars.length - 4}
                </span>
              </div>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
