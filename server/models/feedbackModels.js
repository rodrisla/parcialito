import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    preguntaTexto: { type: String, required: true },
    respuestaCorrecta: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

export default mongoose.model('Feedback', FeedbackSchema); //  ¡Así es la forma correcta!