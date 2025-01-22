"use client";

import Header from "../components/header";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function Cart() {
  const { cartItems, stockItems, setCartItems, removeFromCart } =
    useCart();
  const [activeModal, setActiveModal] = useState<"none" | "error" | "address">(
    "none"
  );
  const [modalMessage, setModalMessage] = useState("");
  const [address, setAddress] = useState("");

  // Função para calcular o valor total do carrinho
  const totalValue = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const itemPrice = parseFloat(
        item.preco.replace("R$", "").replace(",", ".")
      );
      return acc + itemPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  const handleQuantityChange = (itemName: string, newQuantity: number) => {
    const stockItem = stockItems.find((stock) => stock.name === itemName);

    if (stockItem && newQuantity <= stockItem.stock) {
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.name === itemName ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      setModalMessage("Quantidade excede o estoque disponível.");
      setActiveModal("error");
    }
  };

  const handleRemoveItem = (itemName: string) => {
    removeFromCart(itemName);
  };

  const handleOpenAddressModal = () => {
    setActiveModal("address");
  };

  const handleFinalizeOrder = () => {
    const productsList = cartItems
      .map(
        (item) =>
          `${item.quantity}x ${item.name} (${item.description}) - ${item.preco}`
      )
      .join("\n");

    const message = `*Pedido Finalizado:*\n\n${productsList}\n\n*Valor Total:* R$ ${totalValue.toFixed(
      2
    )}\n\n*Endereço de Entrega:*\n${address}`;

    const whatsappUrl = `https://wa.me/5534991960064?text=${encodeURIComponent(
      message
    )}`;

    setCartItems([]);
    localStorage.removeItem("cartItems");
    window.open(whatsappUrl, "_blank");
  };

  const getStock = (itemName: string) => {
    const stockItem = stockItems.find((stock) => stock.name === itemName);
    return stockItem ? stockItem.stock : 0;
  };

  return (
    <>
      <Header />
      <div className="bg-black">
        <h1 className="text-amber-300 text-center py-4 font-bold font-bebas-neue text-5xl">
          CARRINHO
        </h1>
        {cartItems.length > 0 && (
          <p className="text-white text-center py-4 text-3xl">
            CLIQUE EM <strong>FINALIZAR PEDIDO</strong> E SERÁ REDIRECIONADO
            PARA O NOSSO WHATSAPP
          </p>
        )}
        <div className="p-4 text-white">
          {cartItems.length > 0 ? (
            <div className="flex flex-col gap-6">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white text-black rounded-lg p-4"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-bold uppercase">{item.name}</h2>
                    <p className="text-sm text-gray-600 ">{item.description}</p>
                    <p className="text-sm font-semibold ">{item.preco}</p>
                    <div className="flex flex-col sm:flex-row  sm:items-center gap-2 mt-2">
                      <label htmlFor={`quantity-${index}`} className="text-sm">
                        Quantidade:
                      </label>
                      <input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        max={getStock(item.name)}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.name,
                            parseInt(e.target.value, 10)
                          )
                        }
                        className="border rounded p-1 w-16 text-center"
                      />
                      <span className="text-xs sm:text-sm">
                        (Disponível: {getStock(item.name)})
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.name)}
                      className="bg-red-500 hover:bg-red-400 transition-all text-white px-2 py-1 mt-2 rounded"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center flex-col">
              <p className="text-center font-bebas-neue text-2xl pb-4">Seu carrinho está vazio.</p>
              <Link href={"/"}>
                <button className="bg-white font-bold font-bebas-neue text-2xl hover:bg-slate-300 text-black px-4 py-4 rounded-full">
                  CLIQUE AQUI PARA ADICIONAR PRODUTOS AO CARRINHO
                </button>
              </Link>
            </div>
          )}
          <div className="flex items-center gap-4 bg-white text-black rounded-lg p-4 mt-6">
            <h1>Valor total:</h1>
            <p className="font-bold text-xl">R$ {totalValue.toFixed(2)}</p>
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="flex justify-center my-6">
            <button
              onClick={handleOpenAddressModal}
              className="bg-white hover:bg-slate-300 text-black px-4 py-4 rounded-full"
            >
              FINALIZAR PEDIDO
            </button>
          </div>
        )}
      </div>

      {activeModal === "error" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <p className="text-red-500 font-bold mb-4">{modalMessage}</p>
            <button
              className="bg-black hover:bg-slate-600 transition-all text-white px-4 py-2 rounded"
              onClick={() => setActiveModal("none")}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {activeModal === "address" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">Informe o endereço:</h2>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-32 p-2 border rounded"
              placeholder="Digite o endereço completo de entrega"
            />
            <div className="mt-4 flex gap-4 justify-center">
              <button
                onClick={handleFinalizeOrder}
                className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded"
              >
                Finalizar Pedido
              </button>
              <button
                onClick={() => setActiveModal("none")}
                className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
