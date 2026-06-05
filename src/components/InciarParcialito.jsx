import { Link } from "react-router-dom";

export default function IniciarParcialito() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f7fa",
                padding: "20px"
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: "40px",
                    borderRadius: "16px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    maxWidth: "600px",
                    textAlign: "center"
                }}
            >
                <h1
                    style={{
                        marginBottom: "20px",
                        fontSize: "2.5rem"
                    }}
                >
                    📸 Parcialito de Bioimágenes
                </h1>

                <p
                    style={{
                        fontSize: "1.1rem",
                        lineHeight: "1.6",
                        marginBottom: "30px"
                    }}
                >
                    Poné a prueba tus conocimientos sobre:
                    <br />
                    Cráneo • Senos • ATM • Oído • Cervical • Base de Cráneo • Silla Turca y mucho más.
                </p>

                <div
                    style={{
                        backgroundColor: "#eef6ff",
                        padding: "15px",
                        borderRadius: "10px",
                        marginBottom: "30px"
                    }}
                >
                    <strong>📋 El examen contiene:</strong>
                    <br />
                    Más de 100 preguntas almacenadas!!
                    <br />
                    10 preguntas aleatorias por intento
                    <br />
                    Corrección inmediata
                    <br />
                    **Las preguntas son generadas con IA, si una figura incorrecta chequeá la información con tus apuntes, y reporta cualquier error en el lado derecho del parcialito**
                </div>

                <Link
                    to="/parcialito"
                    style={{
                        display: "inline-block",
                        textDecoration: "none",
                        backgroundColor: "#2563eb",
                        color: "white",
                        padding: "14px 28px",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        transition: "0.3s"
                    }}
                >
                    🚀 Comenzar examen
                </Link>
            </div>
        </div>
    );
}