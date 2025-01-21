import Header from "./components/header";
import Hero from "./hero/page";
import Home from "./home/page";

export default function App() {
  return (
    <>
      <Header />
      <div className="bg-black">
        <Hero/>
        <Home />
      </div>
    </>
  );
}
