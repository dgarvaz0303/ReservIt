"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function MainLayout({ children }) {
  const [rol, setRol] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRol = localStorage.getItem("rol");

    //  si no hay sesión  login
    if (!token) {
      router.replace("/login");
      return;
    }

    setRol(storedRol);
  }, []);

  // evitar render antes de tener datos
  if (!rol) return null;

  return (
    <>
      <Navbar rol={rol} />

      <main style={{ minHeight: "100vh" }}>
        {children}
      </main>

      <Footer />
    </>
  );
}