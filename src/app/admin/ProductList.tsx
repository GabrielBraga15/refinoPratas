"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Product {
  name: string;
  price: string;
  stock: string;
  description: string;
  imageUrl: string;
  category: string;
  gender: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos", error);
      } finally {
        setLoading(false); // Finaliza o carregamento após a resposta
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Produtos</h2>

      {loading ? (
        <p className="text-center text-gray-500">Carregando produtos...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum produto encontrado</p>
      ) : (
        <table className="w-full border-collapse border text-black border-gray-300 bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Preço</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Estoque</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Imagem</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Categoria</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Gênero</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-100 text-black">
                <td className="border border-gray-300 px-4 py-2 min-w-[120px]">{product.name}</td>
                <td className="border border-gray-300 px-4 py-2 min-w-[120px]">{product.price}</td>
                <td className="border border-gray-300 px-4 py-2 min-w-[120px]">{product.stock}</td>
                <td className="border border-gray-300 px-4 py-2 min-w-[120px]">
                  {product.imageUrl ? (
                    <Image
                      width={100}
                      height={100}
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400">Sem imagem</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 min-w-[120px]">{product.category}</td>
                <td className="border border-gray-300 px-4 py-2 min-w-[120px]">{product.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;
