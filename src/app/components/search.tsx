"use client";

import { useState } from "react";

const categories = [
  "escama",
  "duplo grume",
  "pulseiras",
  "3x1",
  "pingente",
  "produtos",
];

export default function Search({ onSearch }: { onSearch: (query: string, category: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query, selectedCategory); // Chamar com categoria selecionada
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    onSearch(searchQuery, selected); // Chamar com o texto já digitado
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          className="p-2 text-black rounded w-full uppercase font-bebas-neue"
          placeholder="Procurar"
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
        />
        <select
          className="p-2 text-black rounded uppercase font-bebas-neue"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option className="uppercase" key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}


