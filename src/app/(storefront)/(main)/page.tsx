import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Bienvenue sur notre site</h1>
      <p>Veuillez vous connecter pour accéder à plus de fonctionnalités.</p>

      {/* Lien pour ouvrir la modale */}
      <Link href="/?modalName=login" style={linkStyle}>
        Ouvrir la modale de connexion
      </Link>
    </main>
  );
}

const linkStyle = {
  display: "inline-block",
  marginTop: "1rem",
  padding: "0.5rem 1rem",
  backgroundColor: "#0070f3",
  color: "white",
  borderRadius: "5px",
  textDecoration: "none",
};
