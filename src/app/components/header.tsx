import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import logo from "../public/assets/logo-header.png";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full bg-white">
      <div className="flex rounded-2xl justify-between px-4 py-8 items-center bg-white">
        <Link href="/">
          <Image src={logo} alt="" width={80} height={80} />
        </Link>
        <Link href="/cart">
          <ShoppingCart className="cursor-pointer text-black" />
        </Link>
      </div>
    </div>
  );
}
