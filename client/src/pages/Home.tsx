import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "../supabaseClient";
import type { Session } from "@supabase/supabase-js";

interface Scholar {
  id: number;
  name: string;
}

const SWIPE_THRESHOLD = 50;

export default function Home({ session }: { session: Session }) {
  const [scholars, setScholars] = useState<(Scholar & { count: number })[]>([]);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swiped = useRef(false);

  useEffect(() => {
    fetchScholarsWithCounts();
  }, []);

  async function fetchScholarsWithCounts() {
    const [{ data: scholarsData }, { data: swipeData }] = await Promise.all([
      supabase.from("scholars").select("id, name").order("name"),
      supabase.from("swipe_rights").select("scholar_id"),
    ]);

    if (!scholarsData) return;

    const counts: Record<number, number> = {};
    if (swipeData) {
      for (const row of swipeData) {
        counts[row.scholar_id] = (counts[row.scholar_id] || 0) + 1;
      }
    }

    setScholars(scholarsData.map((s) => ({ ...s, count: counts[s.id] || 0 })));
  }

  async function handleSwipeRight(scholar: Scholar & { count: number }) {
    // Optimistic update
    setScholars((prev) =>
      prev.map((s) => (s.id === scholar.id ? { ...s, count: s.count + 1 } : s)),
    );
    toast(`+1 ${scholar.name}`, { icon: "👉" });

    const { error } = await supabase.from("swipe_rights").insert({
      swiper_id: session.user.id,
      scholar_id: scholar.id,
    });

    if (error) {
      // Revert on failure
      setScholars((prev) =>
        prev.map((s) =>
          s.id === scholar.id ? { ...s, count: s.count - 1 } : s,
        ),
      );
      toast.error("Failed to record swipe");
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swiped.current = false;
  }

  function handleTouchEnd(
    e: React.TouchEvent,
    scholar: Scholar & { count: number },
  ) {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (deltaY < SWIPE_THRESHOLD && deltaX > SWIPE_THRESHOLD) {
      swiped.current = true;
      handleSwipeRight(scholar);
    }
  }

  function handleClick() {
    if (swiped.current) return;
  }

  console.log(session.user);

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 1500 }} />
      <div className="desktop-message">
        <p>nice try get ur fone out</p>
      </div>
      <div className="app">
        <div className="app-header">
          <p className="directions">Swipe right to add a point.</p>
          <span className="user-display-name">
            {session.user.user_metadata?.display_name ?? session.user.email}
          </span>
        </div>
        <ul className="scholar-list">
          {scholars.map((scholar) => (
            <li
              key={scholar.id}
              onTouchStart={handleTouchStart}
              onTouchEnd={(e) => handleTouchEnd(e, scholar)}
              onClick={() => handleClick()}
            >
              <span className="name">{scholar.name}</span>
              <span className="count">{scholar.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
