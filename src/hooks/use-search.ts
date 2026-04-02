import { useEffect, useState } from "react";

export function useSearch(duration: number = 500) {
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(search);
    }, duration);

    return () => {
      clearTimeout(handler);
    };
  }, [search, duration]);

  return {
    search,
    setSearch,
    searchTerm,
  };
}
