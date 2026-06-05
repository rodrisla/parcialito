// ✅ REEMPLAZÁ LOS 'require' POR ESTOS 'import':
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Feedback from './models/feedbackModels';

dotenv.config(); 

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🔥 Conectado a MongoDB"))
    .catch(err => console.error("❌ Error de conexión:", err));

app.post('/api/feedback', async (req, res) => {
    try {
        const nuevoFeedback = new Feedback(req.body);
        await nuevoFeedback.save();
        res.status(201).json({ success: true, message: "Guardado" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));