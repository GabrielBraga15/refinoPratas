"use client";

import { useState, useEffect } from "react";

const categories = [
  "prata escama",
  "prata duplo grume",
  "pulseira",
  "prata 3x1",
  "produtos",
];

export default function Search({ onSearch }: { onSearch: (query: string, category: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Atualiza a pesquisa sem interferir na categoria selecionada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Atualiza a categoria selecionada sem interferir na pesquisa
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedCategory(selected);

    // Quando uma categoria é selecionada, ela é automaticamente inserida na barra de pesquisa
    setSearchQuery(selected); // Atualiza o valor da barra de pesquisa com o nome da categoria selecionada
  };

  // Chama onSearch sempre que searchQuery ou selectedCategory mudarem
  useEffect(() => {
    onSearch(searchQuery, selectedCategory); // Realiza a pesquisa com os valores atuais
  }, [searchQuery, selectedCategory, onSearch]);

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Barra de pesquisa e categorias combinadas */}
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
          <option className="font-bold" value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
