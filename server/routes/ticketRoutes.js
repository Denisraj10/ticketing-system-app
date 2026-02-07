import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket,
  getTicketStats,
  assignTicket,
  addMessage,
} from '../controllers/ticketController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All ticket routes require authentication
router.use(authMiddleware);

// Ticket creation and retrieval
router.post('/', createTicket);
router.get('/', getTickets);
router.get('/count', getTicketStats);
router.get('/:id', getTicketById);

// Manager-only routes
router.patch('/:id/status', roleMiddleware(['manager']), updateTicketStatus);
router.delete('/:id', roleMiddleware(['manager']), deleteTicket);
router.patch('/:id/assign', roleMiddleware(['manager']), assignTicket);

// Message management
router.post('/:id/messages', addMessage);

export default router;
