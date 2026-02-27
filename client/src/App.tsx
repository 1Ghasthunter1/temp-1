import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "./supabaseClient";
import "./App.css";

interface Scholar {
  id: number;
  name: string;
  count: number;
}

const SWIPE_THRESHOLD = 50;

function App() {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swiped = useRef(false);

  useEffect(() => {
    fetchScholars();
  }, []);

  async function fetchScholars() {
    const { data } = await supabase.from("scholars").select("*");
    if (data) setScholars(data);
  }

  async function incrementCount(scholar: Scholar) {
    const newCount = scholar.count + 1;
    await supabase
      .from("scholars")
      .update({ count: newCount })
      .eq("id", scholar.id);
    setScholars((prev) =>
      prev.map((s) => (s.id === scholar.id ? { ...s, count: newCount } : s)),
    );
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swiped.current = false;
  }

  function handleTouchEnd(e: React.TouchEvent, scholar: Scholar) {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (deltaY < SWIPE_THRESHOLD && deltaX > SWIPE_THRESHOLD) {
      swiped.current = true;
      incrementCount(scholar);
      toast(`+1 ${scholar.name}`, { icon: "👉" });
    }
  }

  function handleClick(_scholar: Scholar) {
    if (swiped.current) return;
  }

  return (
    <div className="mobile-only">
      <Toaster position="top-center" toastOptions={{ duration: 1500 }} />
      <div className="desktop-message">
        <p>nice try get ur fone out</p>
      </div>
      <div className="app">
        <p className="directions">Swipe right to add a point.</p>
        <ul className="scholar-list">
          {scholars.map((scholar) => (
            <li
              key={scholar.id}
              onTouchStart={handleTouchStart}
              onTouchEnd={(e) => handleTouchEnd(e, scholar)}
              onClick={() => handleClick(scholar)}
            >
              <span className="name">{scholar.name}</span>
              <span className="count">{scholar.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
