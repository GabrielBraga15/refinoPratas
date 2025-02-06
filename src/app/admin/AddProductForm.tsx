"use client";
import { useState } from "react";

const AddProductForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState<File | null>(null); // Novo estado para imagem

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
    formData.append("category", category);
    formData.append("gender", gender);
    formData.append("image", image); // Adiciona a imagem no FormData

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData, // Envia os dados como multipart/form-data
      });

      if (response.ok) {
        alert("Produto cadastrado com sucesso!");
        setName("");
        setPrice("");
        setStock("");
        setDescription("");
        setCategory("");
        setGender("");
        setImage(null); // Limpa a imagem após o envio
      } else {
        alert("Erro ao cadastrar produto!");
      }
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Preço"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Estoque"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
      <textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Categoria</option>
        <option value="anéis">Anéis</option>
        <option value="pulseiras">Pulseiras</option>
        <option value="colares">Colares</option>
      </select>
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Gênero</option>
        <option value="masculino">Masculino</option>
        <option value="feminino">Feminino</option>
        <option value="unissex">Unissex</option>
      </select>

      {/* Campo para seleção da imagem */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
      />

      <button type="submit">Cadastrar Produto</button>
    </form>
  );
};

export default AddProductForm;
