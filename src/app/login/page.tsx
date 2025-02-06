"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import netlifyIdentity, { User } from "netlify-identity-widget";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    netlifyIdentity.init();

    const currentUser = netlifyIdentity.currentUser();
    console.log("Usuário atual:", currentUser);

    if (currentUser) {
      setUser(currentUser);

      if (currentUser.confirmed_at) {
        router.push("/admin"); // Redireciona para o painel se o email estiver confirmado
      } else {
        console.log("⚠ E-mail não verificado! Verifique seu e-mail antes de acessar.");
      }
    }

    // Evento de login
    netlifyIdentity.on("login", (user) => {
      console.log("Usuário logado:", user);
      setUser(user);

      if (user.confirmed_at) {
        router.push("/admin");
      } else {
        console.log("⚠ E-mail não verificado! Verifique seu e-mail antes de acessar.");
      }
    });

    // Evento de logout
    netlifyIdentity.on("logout", () => {
      console.log("Usuário deslogado");
      setUser(null);
      router.push("/login");
    });
  }, [router]);

  const handleLogin = () => {
    netlifyIdentity.open();
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Login</h1>
        {user ? (
          <>
            <p className="text-green-600">
              Logado como: {user?.user_metadata?.full_name || "Usuário"}
            </p>
            {!user.confirmed_at && (
              <p className="text-red-500">⚠ Verifique seu e-mail para continuar.</p>
            )}
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Login com Netlify Identity
          </button>
        )}
      </div>
    </div>
  );
}
