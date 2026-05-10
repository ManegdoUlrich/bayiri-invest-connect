import { api } from '@/api/client'

// Crée une notification in-app via l'API.
// L'envoi d'email est géré côté backend (nodemailer) — plus de dépendance base44.
export async function sendNotification({ userId, type, title, message, projectId }) {
  return api.post('/notifications', { userId, type, title, message, projectId })
}

export const notifMessages = {
  milestone_validated: (title) =>
    `Une étape clé a été validée par votre agent sur le terrain : "${title}".`,
  status_change: (status) => {
    const labels = {
      en_cours: 'en cours', pause: 'en pause',
      termine: 'terminé', annule: 'annulé',
    }
    return `Le statut de votre projet a été mis à jour : ${labels[status] || status}.`
  },
  new_report:        (reportTitle) => `Un nouveau rapport est disponible : "${reportTitle}".`,
  payment_due:       (amount, date) =>
    `Un paiement de ${amount?.toLocaleString('fr-FR')} € est dû le ${new Date(date).toLocaleDateString('fr-FR')}.`,
  signature_request: () => 'Votre contrat est prêt à être signé. Connectez-vous pour le signer.',
  signature_done:    () => 'Votre contrat a été signé avec succès.',
}
