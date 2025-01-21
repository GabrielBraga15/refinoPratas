"use client";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import logo from "../public/assets/logo-header.png";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="w-full bg-white">
      <div className="flex rounded-2xl justify-between px-4 py-8 items-center bg-white">
        <Link href="/">
          <Image src={logo} alt="" width={80} height={80} />
        </Link>
        <Link href="/cart" className="relative">
          <ShoppingCart className="cursor-pointer text-black" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
