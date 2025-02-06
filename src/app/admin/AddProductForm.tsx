import { useState } from "react";

const categoriesList = [
  "Escama",
  "3x1",
  "Duplo grume",
  "Pingente",
  "Produtos",
  "Anel",
  "Pulseira",
  "Colar",
  "Tornozeleira",
  "Berloque",
  "Brinco",
  "Piercing",
  "Conjuntos",
];

const AddProductForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [gender, setGender] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleCategoryChange = (category: string) => {
    setCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!image) {
      alert("Por favor, adicione uma imagem.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("category", categories.join(", "));
    formData.append("gender", gender);
    formData.append("image", image);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Produto cadastrado com sucesso!");
        setName("");
        setPrice("");
        setStock("");
        setDescription("");
        setCategories([]);
        setGender("");
        setImage(null);
      } else {
        alert("Erro ao cadastrar produto!");
      }
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
    }
  };

  return (
    <form className="flex flex-col gap-6 text-black p-3" onSubmit={handleSubmit} encType="multipart/form-data">
      <input className="placeholder-black p-2 rounded-md" type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="placeholder-black p-2 rounded-md" type="text" placeholder="Preço" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input className="placeholder-black text-black p-2 rounded-md" type="number" placeholder="Estoque" value={stock} onChange={(e) => setStock(e.target.value)} />
      <textarea className="placeholder-black p-2 rounded-md" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />

      {/* Checkboxes para categorias */}
      <div className="flex flex-wrap gap-2">
        {categoriesList.map((category) => (
          <label key={category} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              value={category}
              checked={categories.includes(category)}
              onChange={() => handleCategoryChange(category)}
              className="w-5 h-5"
            />
            {category}
          </label>
        ))}
      </div>

      <select className="rounded-md text-black p-2" value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Gênero</option>
        <option value="masculino">Masculino</option>
        <option value="feminino">Feminino</option>
        <option value="unissex">Unissex</option>
      </select>

      <input className=" bg-white font-bold font-bebas-neue text-base hover:bg-slate-300 text-black px-4 py-4 rounded-full" type="file" accept="image/*" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />

      <button className="bg-green-700 font-bold font-bebas-neue text-base hover:bg-green-500 text-black px-2 py-2 rounded-full" type="submit">
        Cadastrar Produto
      </button>
    </form>
  );
};

export default AddProductForm;
