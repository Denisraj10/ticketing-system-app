import Ticket from '../models/Ticket.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

export const createTicket = async (req, res) => {
  try {
    const { ticketName, description, contactName, email, phone, dueDate } = req.body;

    // Validate required fields
    if (!ticketName || !description || !contactName || !email || !phone || !dueDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const ticket = new Ticket({
      ticketName,
      description,
      contactName,
      email,
      phone,
      dueDate: new Date(dueDate),
      createdBy: req.user.userId,
      status: 'Open',
      messages: [],
      attachments: [],
    });

    await ticket.save();
    await ticket.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      ticket,
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    // Non-managers can only see their own tickets
    if (req.user.role !== 'manager') {
      query.createdBy = req.user.userId;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Search by ticket name or contact name
    if (search) {
      query.$or = [
        { ticketName: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('messages');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check authorization
    if (req.user.role !== 'manager' && ticket.createdBy._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error('Get ticket by ID error:', error);
    res.status(500).json({ message: 'Error fetching ticket', error: error.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only managers can update status
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can update ticket status' });
    }

    const validStatuses = ['Open', 'Closed', 'On Hold'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      ticket,
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({ message: 'Error updating ticket status', error: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    // Only managers can delete tickets
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can delete tickets' });
    }

    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully',
      deletedTicketId: id,
    });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ message: 'Error deleting ticket', error: error.message });
  }
};

export const getTicketStats = async (req, res) => {
  try {
    let query = {};

    // Non-managers get stats for only their tickets
    if (req.user.role !== 'manager') {
      query.createdBy = req.user.userId;
    }

    const openCount = await Ticket.countDocuments({ ...query, status: 'Open' });
    const closedCount = await Ticket.countDocuments({ ...query, status: 'Closed' });
    const onHoldCount = await Ticket.countDocuments({ ...query, status: 'On Hold' });
    const totalCount = openCount + closedCount + onHoldCount;

    res.status(200).json({
      success: true,
      stats: {
        open: openCount,
        closed: closedCount,
        onHold: onHoldCount,
        total: totalCount,
      },
    });
  } catch (error) {
    console.error('Get ticket stats error:', error);
    res.status(500).json({ message: 'Error fetching ticket statistics', error: error.message });
  }
};

export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { managerId } = req.body;

    // Only managers can assign tickets
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can assign tickets' });
    }

    // Verify the manager exists
    const manager = await User.findById(managerId);
    if (!manager || manager.role !== 'manager') {
      return res.status(400).json({ message: 'Invalid manager ID' });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { assignedTo: managerId, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket assigned successfully',
      ticket,
    });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({ message: 'Error assigning ticket', error: error.message });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, sender } = req.body;

    if (!text || !sender) {
      return res.status(400).json({ message: 'Text and sender are required' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Create new message
    const message = new Message({
      sender,
      text,
      attachments: [],
      timestamp: new Date(),
    });

    await message.save();

    // Add message to ticket
    ticket.messages.push(message._id);
    ticket.updatedAt = new Date();
    await ticket.save();

    await ticket.populate('messages');

    res.status(201).json({
      success: true,
      message: 'Message added successfully',
      ticket,
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: 'Error adding message', error: error.message });
  }
};
