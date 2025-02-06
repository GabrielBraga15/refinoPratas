"use client";
import { useState, useEffect } from "react";
import Search from "../components/search";
import Card from "../components/card";
import { useCart } from "../context/CartContext";
import { StaticImageData } from "next/image";

interface Model {
  name: string;
  image: StaticImageData;
  description: string;
  preco: string;
  stock: number;
  category: string[];
  gender: string; // <-- Novo campo
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGender, setSelectedGender] = useState<
    "masculino" | "feminino" | ""
  >("");
  const [models, setModels] = useState<Model[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockItems, setStockItems] = useState<
    { name: string; stock: number }[]
  >([]);
  const { cartItems, addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sheets");
        const data = await response.json();

        if (Array.isArray(data) && Array.isArray(data[0])) {
          const formattedData: Model[] = data.slice(1).map((row) => ({
            name: row[0],
            preco: row[1],
            stock: parseInt(row[2], 10),
            description: row[3],
            image: row[4].includes("drive.google.com")
              ? row[4]
                  .replace(
                    "https://drive.google.com/file/d/",
                    "https://drive.google.com/uc?id="
                  )
                  .replace("/view?usp=drive_link", "")
              : row[4],
            category: row[5]
              .split(",")
              .map((cat: string) => cat.trim().toLowerCase()),
            gender: row[6].toLowerCase(), // <-- Pegando o gênero da planilha
          }));

          // Atualizar os modelos com os novos produtos
          setModels(formattedData);

          // Atualizar os itens de estoque
          let updatedStockItems = formattedData.map((newProduct) => ({
            name: newProduct.name,
            stock: newProduct.stock,
          }));

          // Subtrair a quantidade dos itens no carrinho
          cartItems.forEach((cartItem) => {
            updatedStockItems = updatedStockItems.map((stockItem) =>
              stockItem.name === cartItem.name
                ? { ...stockItem, stock: stockItem.stock - cartItem.quantity }
                : stockItem
            );
          });

          // Atualizar os itens de estoque com as mudanças
          setStockItems(updatedStockItems);

          // Atualizar o localStorage com os novos dados
          localStorage.setItem("models", JSON.stringify(formattedData));
          localStorage.setItem("stockItems", JSON.stringify(updatedStockItems));
        } else {
          console.error("A resposta da API não é um array de arrays.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    // Forçar a recarga dos dados
    fetchData();
  }, [cartItems]); // Esse efeito agora vai rodar sempre que o carrinho mudar

  // Salvar as alterações no estoque e nos modelos no localStorage
  useEffect(() => {
    if (stockItems.length > 0) {
      localStorage.setItem("stockItems", JSON.stringify(stockItems));
    }
    if (models.length > 0) {
      localStorage.setItem("models", JSON.stringify(models));
    }
  }, [stockItems, models]);

  // Função para atualizar o estoque
  const updateStock = (productName: string, newStock: number) => {
    setStockItems((prevStock) =>
      prevStock.map((stock) =>
        stock.name === productName ? { ...stock, stock: newStock } : stock
      )
    );
  };

  const filteredModels = models.filter(
    (model) =>
      (searchQuery === "" ||
        model.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === "" ||
        model.category.some((cat) => cat === selectedCategory.toLowerCase())) &&
      (selectedGender === "" || model.gender === selectedGender) // <-- Filtro por gênero
  );

  return (
    <div className="bg-black h-full text-white">
      <div className="flex justify-center gap-7">
        <button
          className={`${
            selectedGender === "masculino" ? "bg-blue-500" : "bg-blue-400"
          } font-bebas-neue text-2xl hover:bg-blue-500 transition-all duration-100 text-white px-4 py-4 rounded-full`}
          onClick={() => setSelectedGender("masculino")}
        >
          PRATAS MASCULINAS
        </button>
        <button
          className={`${
            selectedGender === "feminino" ? "bg-pink-500" : "bg-pink-400"
          } font-bebas-neue text-2xl hover:bg-pink-500 transition-all duration-100 text-white px-4 py-4 rounded-full`}
          onClick={() => setSelectedGender("feminino")}
        >
          PRATAS FEMININAS
        </button>
      </div>

      <Search
        onSearch={(query, category) => {
          setSearchQuery(query);
          setSelectedCategory(category);

        } } selectedGender={selectedGender}/>
      <div
        className="sm:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4 p-6 bg-black 
  justify-center flex flex-col items-center"
      >
        {filteredModels.map((model, index) => (
          <Card
            key={index}
            name={model.name}
            image={model.image}
            description={model.description}
            preco={model.preco}
            stock={model.stock}
            updateStock={updateStock}
            stockItems={stockItems}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}
