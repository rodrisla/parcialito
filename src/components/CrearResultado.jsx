import { Link, useLocation } from "react-router-dom";

export default function Resultado() {

    const { state } = useLocation();

    const puntaje = state?.puntaje || 0;
    const total = state?.total || 10;

    const porcentaje = Math.round(
        (puntaje / total) * 100
    );

    const mensaje = () => {

        if (porcentaje >= 90)
            return "🔥 Excelente. Nivel ayudante de cátedra.";

        if (porcentaje >= 70)
            return "👏 Muy buen trabajo.";

        if (porcentaje >= 50)
            return "📚 Vas bien, pero hay temas para repasar.";

        return "💀 Waters, Towne y Schüller te están esperando.";
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f7fa",
                padding: "20px"
            }}
        >

            <div
                style={{
                    background: "white",
                    padding: "40px",
                    borderRadius: "16px",
                    boxShadow:
                        "0 10px 25px rgba(0,0,0,.15)",
                    width: "500px",
                    textAlign: "center"
                }}
            >

                <h1>
                    📋 Resultado del Parcialito
                </h1>

                <h2
                    style={{
                        fontSize: "3rem",
                        margin: "20px 0"
                    }}
                >
                    {puntaje}/{total}
                </h2>

                <h3>
                    {porcentaje}%
                </h3>

                <p
                    style={{
                        fontSize: "1.2rem",
                        marginTop: "20px"
                    }}
                >
                    {mensaje()}
                </p>

                <Link
                    to="/parcialito"
                    style={{
                        display: "inline-block",
                        marginTop: "30px",
                        padding:
                            "12px 24px",
                        background:
                            "#2563eb",
                        color: "white",
                        textDecoration:
                            "none",
                        borderRadius:
                            "10px",
                        fontWeight:
                            "bold"
                    }}
                >
                    🔄 Generar nuevo examen
                </Link>

            </div>

        </div>

    );
}