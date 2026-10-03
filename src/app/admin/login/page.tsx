"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (r.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid admin credentials.");
    }
  }

  return (
    <main className="login">
      <div className="loginbox">
        <Image src="/tripple-tee-logo.svg" alt="Tripple Tee Travellers" width={75} height={75} />
        <h1 style={{ font: "800 34px Manrope" }}>Welcome back</h1>
        <p>Manage trips, photos and videos.</p>
        <form className="form" onSubmit={submit}>
          <input type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p style={{ color: "#a52d22" }}>{error}</p>}
          <button className="btn">Sign in</button>
        </form>
      </div>
    </main>
  );
}