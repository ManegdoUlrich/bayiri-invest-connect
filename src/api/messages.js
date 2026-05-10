import { api } from './client'

export const messagesApi = {
  list:        (projectId)            => api.get(`/messages?projectId=${projectId}`),
  send:        (projectId, content, receiverId) =>
                                         api.post('/messages', { projectId, content, receiverId }),
  unreadCount: ()                     => api.get('/messages/unread-count'),
  addAttachment: (messageId, file)    => {
    const fd = new FormData()
    fd.append('file', file)
    return api.upload(`/messages/${messageId}/attachments`, fd)
  },
}
