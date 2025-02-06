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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos", error);
      }
    };
    

    fetchProducts();
  }, []);

  return (
    <div className="overflow-x-auto p-4">
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
  {Array.isArray(products) && products.length > 0 ? (
    products.map((product, index) => (
      <tr key={index} className="hover:bg-gray-100 text-black">
        <td className="border border-gray-300 px-4 py-2 min-w-[120px]">{product.name}</td>
        <td className="border border-gray-300 px-4 py-2 min-w-[120px]">{product.price}</td>
        <td className="border border-gray-300 px-4 py-2 min-w-[120px]">{product.stock}</td>
        <td className="border border-gray-300 px-4 py-2 min-w-[120px]">
          <Image width={100} height={100} src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
        </td>
        <td className="border border-gray-300 px-4 py-2 min-w-[120px]">{product.category}</td>
        <td className="border border-gray-300 px-4 py-2 min-w-[120px]">{product.gender}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="border border-gray-300 px-4 py-2 text-center">
        Nenhum produto encontrado
      </td>
    </tr>
  )}
</tbody>

  </table>
</div>

  );
};

export default ProductList;
