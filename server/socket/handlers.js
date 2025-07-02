export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user to their personal room
    socket.on('join-user-room', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join admin to admin room
    socket.on('join-admin-room', (adminId) => {
      socket.join('admin-room');
      console.log(`Admin ${adminId} joined admin room`);
    });

    // Handle bot message events
    socket.on('bot-message', (data) => {
      // Broadcast to user's room
      socket.to(`user-${data.userId}`).emit('new-bot-message', data);
      
      // Broadcast to admin room for monitoring
      socket.to('admin-room').emit('bot-activity', {
        type: 'message',
        userId: data.userId,
        botId: data.botId,
        timestamp: new Date(),
        data
      });
    });

    // Handle order events
    socket.on('new-order', (orderData) => {
      // Notify user
      socket.to(`user-${orderData.userId}`).emit('order-update', orderData);
      
      // Notify admins
      socket.to('admin-room').emit('new-order-notification', orderData);
    });

    // Handle system alerts
    socket.on('system-alert', (alertData) => {
      socket.to('admin-room').emit('system-alert', alertData);
    });

    // Handle real-time analytics updates
    socket.on('analytics-update', (data) => {
      socket.to(`user-${data.userId}`).emit('analytics-data', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};