const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Référence à l'utilisateur
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true }, // Référence à la note
  summary: { type: String, required: true }, // Résumé global du rapport
  points: [{ title: String, description: String }], // Points abordés dans le rapport (un tableau d'objets pour plus de flexibilité)
  decisions: [{ decision: String, personResponsible: String }], // Décisions prises et les responsables
  actions: [{ action: String, dueDate: Date }], // Actions à mener avec une date d'échéance si nécessaire
  generatedAt: { type: Date, default: Date.now }, // Date de création du rapport
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
