import { useState, useEffect } from "react";
import { preguntas } from "../mock/preguntas";
import { useNavigate } from "react-router-dom";

export default function Parcialito() {
    const navigate = useNavigate();

    // Estado para controlar los campos del formulario de feedback
    const [feedbackForm, setFeedbackForm] = useState({
        nombre: "",
        preguntaTexto: "",
        respuestaCorrecta: ""
    });

    const shuffleArray = (array) => {
        if (!array || !Array.isArray(array)) {
            return [];
        }
        const copia = [...array];
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia;
    };

    const generarParcial = () => {
        const usadas = JSON.parse(
            localStorage.getItem("preguntasUsadas") || "[]"
        );

        let disponibles = preguntas.filter(
            pregunta => !usadas.includes(pregunta.id)
        );

        if (disponibles.length === 0) {
            disponibles = [...preguntas];
        }
        else if (disponibles.length < 10) {
            const repetidas = preguntas.filter(p => usadas.includes(p.id));
            disponibles = [...disponibles, ...shuffleArray(repetidas)];
        }

        return shuffleArray(disponibles)
            .slice(0, 10)
            .map((pregunta) => ({
                ...pregunta,
                opciones: shuffleArray(pregunta.opciones)
            }));
    };

    const [quiz] = useState(generarParcial);
    const [respuestas, setRespuestas] = useState({});
    const [puntaje, setPuntaje] = useState(0);
    const [finalizado, setFinalizado] = useState(false);
    const letras = ["A", "B", "C"];

    useEffect(() => {
        const usadas = JSON.parse(localStorage.getItem("preguntasUsadas") || "[]");
        if (usadas.length >= preguntas.length) {
            window.alert("Se han agotado las preguntas nuevas disponibles. El banco de preguntas se reiniciará automáticamente.");
            localStorage.removeItem("preguntasUsadas");
        }
    }, []);

    const responder = (pregunta, opcion) => {
        if (respuestas[pregunta.id]) return;

        setRespuestas(prev => ({
            ...prev,
            [pregunta.id]: opcion
        }));

        if (opcion === pregunta.respuesta) {
            setPuntaje(prev => prev + 1);
        }
    };

    const finalizarExamen = () => {
        const usadas = JSON.parse(
            localStorage.getItem("preguntasUsadas") || "[]"
        );

        localStorage.setItem(
            "preguntasUsadas",
            JSON.stringify([
                ...usadas,
                ...quiz.map(p => p.id)
            ])
        );

        navigate("/resultado", {
            state: {
                puntaje,
                total: quiz.length
            }
        });
    };

    // Manejador asíncrono para enviar el feedback a MongoDB mediante la API Express
    const enviarFeedback = async (e) => {
        e.preventDefault();
        
        try {
            const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(feedbackForm)
            });

            const resultado = await respuesta.json();

            if (resultado.success) {
                window.alert(`¡Gracias ${feedbackForm.nombre}! Tu reporte ha sido guardado en la base de datos.`);
                
                // Limpiar formulario conservando el nombre del alumno por comodidad
                setFeedbackForm(prev => ({
                    ...prev,
                    preguntaTexto: "",
                    respuestaCorrecta: ""
                }));
            } else {
                window.alert("Hubo un problema al procesar el reporte en el servidor.");
            }

        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            window.alert("No se pudo conectar con el servidor. Por favor, verifica que el backend esté encendido.");
        }
    };

    // Función auxiliar para auto-rellenar la pregunta desde el botón de reporte
    const copiarAlFormulario = (textoPregunta) => {
        setFeedbackForm(prev => ({
            ...prev,
            preguntaTexto: textoPregunta
        }));
        // Hace scroll suave directo al formulario para avisarle al usuario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fa",
                padding: "20px"
            }}
        >
            {/* Contenedor Principal en Flexbox para dos columnas */}
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    gap: "25px",
                    flexWrap: "wrap-reverse"
                }}
            >
                {/* COLUMNA IZQUIERDA: EXAMEN */}
                <div style={{ flex: "2", minWidth: "300px" }}>
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "30px",
                            borderRadius: "16px",
                            boxShadow: "0 8px 24px rgba(0,0,0,.12)",
                            marginBottom: "25px",
                            textAlign: "center"
                        }}
                    >
                        <h1 style={{ marginBottom: "10px" }}>📸 Parcialito de Bioimágenes</h1>
                        <h2 style={{ color: "#666" }}>Responda las siguientes 10 preguntas</h2>
                        <div
                            style={{
                                marginTop: "20px",
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                color: "#2563eb"
                            }}
                        >
                            Puntaje actual: {puntaje}/{quiz.length}
                        </div>
                    </div>

                    {quiz.map((pregunta, index) => (
                        <div
                            key={pregunta.id}
                            style={{
                                backgroundColor: "white",
                                borderRadius: "16px",
                                padding: "25px",
                                marginBottom: "20px",
                                boxShadow: "0 4px 12px rgba(0,0,0,.08)",
                                position: "relative"
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px" }}>
                                <h3 style={{ marginBottom: "20px", lineHeight: "1.5", flex: 1 }}>
                                    {index + 1}. {pregunta.pregunta}
                                </h3>
                                {/* Botón para reportar error rápido */}
                                <button
                                    onClick={() => copiarAlFormulario(pregunta.pregunta)}
                                    type="button"
                                    style={{
                                        backgroundColor: "#fef3c7",
                                        color: "#d97706",
                                        border: "1px solid #fcd34d",
                                        borderRadius: "6px",
                                        padding: "4px 8px",
                                        fontSize: "0.8rem",
                                        cursor: "pointer",
                                        fontWeight: "600"
                                    }}
                                    title="Reportar un error en esta pregunta"
                                >
                                    ⚠️ Reportar
                                </button>
                            </div>

                            {pregunta.opciones.map((opcion, opcionIndex) => {
                                const respondida = respuestas[pregunta.id];
                                let backgroundColor = "#f8fafc";

                                if (respondida) {
                                    if (opcion === pregunta.respuesta) {
                                        backgroundColor = "#bbf7d0";
                                    }
                                    if (opcion === respondida && opcion !== pregunta.respuesta) {
                                        backgroundColor = "#fecaca";
                                    }
                                }

                                return (
                                    <button
                                        key={`${pregunta.id}-${opcion}`}
                                        disabled={!!respondida}
                                        onClick={() => responder(pregunta, opcion)}
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                            padding: "14px",
                                            margin: "10px 0",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "10px",
                                            backgroundColor,
                                            cursor: respondida ? "default" : "pointer",
                                            fontSize: "1rem"
                                        }}
                                    >
                                        <strong>{letras[opcionIndex]})</strong>{" "}{opcion}
                                    </button>
                                );
                            })}
                        </div>
                    ))}

                    {!finalizado && (
                        <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "40px" }}>
                            <button
                                onClick={finalizarExamen}
                                style={{
                                    backgroundColor: "#2563eb",
                                    color: "white",
                                    border: "none",
                                    padding: "15px 35px",
                                    borderRadius: "12px",
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                ✅ Finalizar examen
                            </button>
                        </div>
                    )}
                </div>

                {/* COLUMNA DERECHA: FORMULARIO DE FEEDBACK */}
                <div style={{ flex: "1", minWidth: "300px" }}>
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "25px",
                            borderRadius: "16px",
                            boxShadow: "0 8px 24px rgba(0,0,0,.12)",
                            position: "sticky",
                            top: "20px"
                        }}
                    >
                        <h3 style={{ marginTop: 0, marginBottom: "15px", color: "#1e293b", display: "flex", alignItems: "center", gap: "8px" }}>
                            📝 Buzón de Feedback
                        </h3>
                        <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "20px" }}>
                            ¿Encontraste una pregunta errónea? Reportala acá o tocá el botón amarillo de <strong>⚠️ Reportar</strong> en la pregunta para rellenarlo automáticamente.
                        </p>

                        <form onSubmit={enviarFeedback}>
                            {/* Campo: Nombre */}
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem", color: "#475569" }}>
                                    Tu Nombre:
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej. Juan Pérez"
                                    value={feedbackForm.nombre}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, nombre: e.target.value })}
                                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                                />
                            </div>

                            {/* Campo: Pregunta Mal Estructurada */}
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem", color: "#475569" }}>
                                    Pregunta con error:
                                </label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Escribe aquí el enunciado de la pregunta..."
                                    value={feedbackForm.preguntaTexto}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, preguntaTexto: e.target.value })}
                                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                                />
                            </div>

                            {/* Campo: Sugerencia de Respuesta Correcta */}
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9rem", color: "#475569" }}>
                                    ¿Cuál debería ser la respuesta correcta?
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Explica cuál es la opción adecuada"
                                    value={feedbackForm.respuestaCorrecta}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, respuestaCorrecta: e.target.value })}
                                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                                />
                            </div>

                            {/* Botón de Enviar */}
                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    backgroundColor: "#ef4444",
                                    color: "white",
                                    border: "none",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.2)"
                                }}
                            >
                                Enviar Reporte
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}