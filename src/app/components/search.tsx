"use client";

import { useState, useEffect } from "react";

const maleCategories = ["escama", "duplo grume", "pulseiras", "3x1", "pingente"];
const femaleCategories = ["anel", "pulseiras", "colar", "tornozeleira", "berloque", "brinco", "piercing", "conjuntos"];

export default function Search({ onSearch, selectedGender }: { onSearch: (query: string, category: string) => void, selectedGender: "masculino" | "feminino" | "" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (selectedGender === "masculino") {
      setCategories(maleCategories);
    } else if (selectedGender === "feminino") {
      setCategories(femaleCategories);
    } else {
      setCategories([]);
    }
  }, [selectedGender]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query, selectedCategory);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    onSearch(searchQuery, selected);
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
        {categories.length > 0 && (
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
        )}
      </div>
    </div>
  );
}
