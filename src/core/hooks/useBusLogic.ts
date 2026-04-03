import type { SeatType } from "@/app/features/trips/bus/busTypes";
import type { Ticket } from "@/app/features/trips/data/ticket";
import { useMemo, useState } from "react";

export function useBusLogic(seats: SeatType[], tickets: Ticket[])
{
  const [hoverFilter, setHoverFilter] = useState<{ type: string; value: string; } | undefined>(undefined);

  const ticketMap = useMemo(() =>
  {
    const map: Record<number, Ticket> = {};
    tickets.filter((t) => t.chairNo > 0).forEach((t) =>
    {
      map[t.chairNo] = t;
    });
    return map;
  }, [tickets]);

  const babyTickets = useMemo(() =>
  {
    return tickets.filter((t) => t.chairNo < 0).sort((a, b) => b.chairNo - a.chairNo);
  }, [tickets]);

  const nextBabyId = useMemo(() =>
  {
    const minId = babyTickets.reduce((min, t) => Math.min(min, t.chairNo), 0);
    return minId - 1;
  }, [babyTickets]);

  const columns = useMemo(() =>
  {
    const cols = [];
    for (let i = 0; i < seats.length; i += 4)
    {
      cols.push(seats.slice(i, i + 4));
    }
    return cols;
  }, [seats]);

  const handleHover = (type: any, value?: string) =>
  {
    if (!type)
    {
      setHoverFilter(undefined);
    }
    else
    {
      setHoverFilter({ type, value: value || "" });
    }
  };

  return { ticketMap, babyTickets, nextBabyId, columns, hoverFilter, handleHover };
}
