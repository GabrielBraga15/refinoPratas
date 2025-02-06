// src/app/login/page.tsx

"use client"; // Certifique-se de que isso esteja no topo do arquivo

import netlifyIdentity from "netlify-identity-widget";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Para garantir que useRouter seja de next/navigation

export default function LoginPage() {
  const router = useRouter(); // Este hook é seguro aqui porque o componente é cliente

  useEffect(() => {
    netlifyIdentity.init(); // Inicializa o Netlify Identity
  }, []);

  const handleLogin = () => {
    netlifyIdentity.open(); // Abre o modal de login do Netlify Identity
  };

  const handleLogout = () => {
    netlifyIdentity.logout(); // Realiza o logout
    router.push("/login"); // Após logout, redireciona para a página de login
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Login</h1>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Login com Netlify Identity
        </button>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
