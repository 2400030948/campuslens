"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { College } from "@/lib/data/types";
import Select from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface CollegeSelectorProps {
  allColleges: College[];
  selectedIds: string[];
}

const MAX_SLOTS = 3;

export default function CollegeSelector({ allColleges, selectedIds }: CollegeSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const slots = [...selectedIds];
  while (slots.length < Math.max(2, Math.min(MAX_SLOTS, selectedIds.length + 1))) {
    slots.push("");
  }

  function setIds(newIds: string[]) {
    const params = new URLSearchParams(searchParams?.toString());
    const cleaned = newIds.filter(Boolean);
    if (cleaned.length > 0) {
      params.set("ids", cleaned.join(","));
    } else {
      params.delete("ids");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSlotChange(index: number, value: string) {
    const next = [...slots];
    next[index] = value;
    setIds(next);
  }

  function removeSlot(index: number) {
    const next = slots.filter((_, i) => i !== index);
    setIds(next);
  }

  return (
    <div className="rounded border border-line bg-paper-raised p-5">
      <h2 className="eyebrow mb-4">Choose up to {MAX_SLOTS} colleges</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {slots.slice(0, MAX_SLOTS).map((id, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                College {index + 1}
              </label>
              <Select
                value={id}
                onChange={(e) => handleSlotChange(index, e.target.value)}
                aria-label={`Select college ${index + 1}`}
              >
                <option value="">Select a college…</option>
                {allColleges.map((c) => (
                  <option key={c.id} value={c.id} disabled={slots.includes(c.id) && id !== c.id}>
                    {c.shortName}
                  </option>
                ))}
              </Select>
            </div>
            {id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSlot(index)}
                aria-label={`Remove college ${index + 1}`}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
