"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

export default function Home() {
  const [idUsuario, setIdUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch('/api/post');
      const response = await data.json();
      console.log(response);
    };
    fetchData();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUsuario, password }),
    });
    const data = await res.json();
    if (data.success) {
      setMensaje("Login exitoso");
      document.cookie = "auth=1; path=/";
      router.push("/dashboard");
    } else {
      setMensaje(data.error || "Error desconocido");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: "2rem auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={idUsuario}
          onChange={e => setIdUsuario(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        {mensaje && <div style={{ color: 'red' }}>{mensaje}</div>}
      </form>

    </div>
  );
}
