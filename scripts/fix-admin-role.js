const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixAdminRole() {
  try {
    console.log('🔍 Checking for support@shipsquared.com user...');
    
    const user = await prisma.user.findUnique({
      where: { email: 'support@shipsquared.com' }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('👤 Found user:', {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    });

    if (user.role === 'admin') {
      console.log('✅ User is already admin');
      return;
    }

    console.log('🔄 Updating user role to admin...');
    
    const updatedUser = await prisma.user.update({
      where: { email: 'support@shipsquared.com' },
      data: { role: 'admin' }
    });

    console.log('✅ User updated successfully:', {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminRole(); 