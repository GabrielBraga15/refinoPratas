"use client"; // Certifique-se de que isso esteja no topo do arquivo

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // useRouter para Next.js 13+
import netlifyIdentity from "netlify-identity-widget";
import AddProductForm from "./AddProductForm";
import ProductList from "./ProductList";

type User = netlifyIdentity.User | null;

export default function AdminPage() {
  const [user, setUser] = useState<User>(null); // Definir tipo do usuário
  const router = useRouter();

  useEffect(() => {
    netlifyIdentity.init();

    // Verificando se o usuário está logado
    const currentUser = netlifyIdentity.currentUser();
    if (!currentUser) {
      router.push("/login"); // Se não estiver logado, redireciona para a página de login
    } else {
      setUser(currentUser); // Se estiver logado, armazena o usuário no estado
    }

    // Assinando eventos de login e logout
    netlifyIdentity.on("login", (user) => {
      setUser(user);
      router.push("/admin"); // Redireciona para a página de admin após o login
    });

    netlifyIdentity.on("logout", () => {
      setUser(null);
      router.push("/login"); // Redireciona para o login após o logout
    });

    // Limpeza dos eventos de login/logout quando o componente for desmontado
    return () => {
      netlifyIdentity.off("login");
      netlifyIdentity.off("logout");
    };
  }, [router]);

  if (!user) {
    return <div>Carregando...</div>; // Exibe um "Carregando..." enquanto o login é verificado
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-4">Painel Administrativo</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Cadastrar Produto</h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <AddProductForm />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lista de Produtos</h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <ProductList />
          </div>
        </section>
      </div>
    </div>
  );
}
