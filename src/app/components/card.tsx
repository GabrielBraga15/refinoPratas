"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

interface CardProps {
  name: string;
  image: StaticImageData;
  description?: string;
  preco: string;
  stock: number;
  stockItems: { name: string; stock: number }[];
  updateStock: (productName: string, newStock: number) => void;
  addToCart: (item: {
    name: string;
    image: StaticImageData;
    description: string;
    preco: string;
    quantity: number;
  }) => void;
}

export default function Card({
  name,
  image,
  description,
  preco,
  stockItems,
  updateStock,
  addToCart,
}: CardProps) {
  const [quantity, setQuantity] = useState(0);
  const [activeModal, setActiveModal] = useState<
    "none" | "buy" | "image" | "error"
  >("none");

  const currentStock =
    stockItems.find((item) => item.name === name)?.stock || 0;

  const increment = () => {
    if (quantity < currentStock) setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    if (quantity > 0) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    const stockItem = stockItems.find((stock) => stock.name === name);

    if (stockItem && quantity > 0 && quantity <= stockItem.stock) {
      addToCart({
        name,
        image,
        description: description || "",
        preco,
        quantity,
      });

      const newStock = stockItem.stock - quantity;
      updateStock(name, newStock);
      setQuantity(0);

      if (activeModal !== "buy") {
        setActiveModal("buy");
      }
    } else {
      setActiveModal("error"); // Abre o modal de erro
    }
  };

  const closeModalOnClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setActiveModal("none");
    }
  };

  return (
    <div className="bg-gray-200 w-56 rounded-lg flex justify-center flex-col items-center p-4">
      {/* Imagem clicável para abrir o modal */}
      <Image
        className="mt-4 mb-4 object-cover cursor-pointer"
        src={image}
        alt={name}
        width={280}
        height={380}
        onClick={() => setActiveModal("image")}
      />

      <div className="flex flex-col items-center gap-4">
        <strong className="w-12 text-black uppercase h-6 mb-2 text-center font-bebas-neue text-lg md:text-2xl">
          {name}
        </strong>

        {description && (
          <p className=" text-gray-700 text-center ">{description}</p>
        )}
        <p className="text-gray-700 text-center font-bold">{preco}</p>
        <div className="flex flex-col">
          <div className="flex justify-center gap-4 pb-2">
            <p className="text-black font-bold">QTD</p>
            <button
              className="text-black max-h-6 bg-gray-300 px-2 rounded"
              onClick={decrement}
              disabled={quantity === 0}
            >
              -
            </button>
            <p className="text-black font-bold">{quantity}</p>
            <button
              className="text-black max-h-6 bg-gray-300 px-2 rounded"
              onClick={increment}
              disabled={quantity >= currentStock}
            >
              +
            </button>
            <p className="text-gray-500 text-sm">E: {currentStock}</p>
          </div>

          <button
            className="rounded-xl mb-4 bg-black transition-all hover:bg-slate-600 text-xs text-white p-2 mx-1 my-1"
            onClick={handleAddToCart}
          >
            ADICIONAR AO CARRINHO
          </button>
        </div>
      </div>

      {/* Modal de confirmação de compra */}
      {activeModal === "buy" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-8 sm:px-0">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center ">
            <p className="text-green-500 font-bold mb-4">
              Produto adicionado ao carrinho
            </p>
            <div className="flex gap-4">
              <Link href="/cart">
                <button
                  className="bg-amber-300 hover:bg-amber-600 transition-all text-black px-4 py-2 rounded"
                  onClick={() => setActiveModal("none")}
                >
                  Ir para o carrinho
                </button>
              </Link>
              <button
                className="bg-black hover:bg-slate-600 transition-all text-white px-4 py-2 rounded"
                onClick={() => setActiveModal("none")}
              >
                Continuar comprando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de erro */}
      {activeModal === "error" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <p className="text-red-500 font-bold mb-4">
              Por favor, selecione uma quantidade válida!
            </p>
            <button
              className="bg-black hover:bg-slate-600 transition-all text-white px-4 py-2 rounded"
              onClick={() => setActiveModal("none")}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de zoom da imagem */}
      {activeModal === "image" && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
          onClick={closeModalOnClickOutside}
        >
          <div className="relative">
            <Image
              src={image}
              alt={`Zoom de ${name}`}
              width={400}
              height={400}
              className="rounded-lg"
            />
            <button
              className="absolute top-2 right-2 text-black bg-white hover:bg-slate-300 rounded-full px-2 py-2 font-bold"
              onClick={() => setActiveModal("none")}
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
