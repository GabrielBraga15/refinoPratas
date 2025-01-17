import Header from "./components/header";
import Home from "./home/page";

export default function App() {
  return (
    <>
      <Header />
      <div className="bg-black">
        <Home />
      </div>
    </>
  );
}
