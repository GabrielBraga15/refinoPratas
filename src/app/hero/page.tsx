import hero from "../public/assets/hero.jpg";
import "@fontsource/bebas-neue";

export default function Hero() {
  return (
    <div className="w-full bg-black">
      <div
        className="relative flex justify-center items-center bg-cover bg-center h-[300px] mb-12"
        style={{ backgroundImage: `url(${hero.src})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>

        <p className="relative text-white text-3xl px-12 md:text-6xl font-bold z-10 text-center font-bebas-neue opacity-0 animate-slide-up">
          Conquiste seu espaço com elegância e prata
        </p>
      </div>
    </div>
  );
}
