"use client";

import { useState } from "react";

export default function Search({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="p-4">
      <input
        className="p-2 text-black rounded w-full"
        placeholder="Procurar"
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
      />
    </div>
  );
}
