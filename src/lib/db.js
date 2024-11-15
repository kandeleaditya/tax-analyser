import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function insertUserDB(username, password) {
  try {
    const user = await prisma.user.create({
      data: {
        username,
        name: 'John Doe',
        email: 'johndoe2@example.com',
        phone: '1234567890',
        status: 'active',
        planEndDate: '2024-12-31T00:00:00.000Z',
        dbPrefix: 'user_',
        password,
      },
    });
    console.log('User created successfully!');
  } catch (err) {
    console.error('Error creating user:', err);
  }
}

export async function getUserDB(username) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
      console.log('DB get user successful!', user);
    } else {
      console.log('DB get user failed.');
    }
    return user;
  } catch (err) {
    console.error('Error retrieving user:', err);
    return null;
  }
}

export async function insertClientListData(data) {
  //console.log('adi db js clientList', data);
  try {
    const result = await prisma.clientList.createMany({
      data: data.map((item) => ({
        clientType: item.ClientType,
        clientName: item.ClientName,
        tfn: item.TFN.toString().trim(),
        lastYearLodged: item.LastYearLodged,
        dbPrefix: item.db_prefix,
      })),
    });
    console.log('Client list data inserted successfully:', result);
  } catch (error) {
    console.error('Error inserting client list data:', error);
  }
}

export async function insertYearlyData(data) {
  //console.log('adi db js yearlyData', data);
  try {
    const result = await prisma.yearlyData.createMany({
      data: data.map((item) => {
        const [year, month, day] = item.DueDate.split('/');
        const dueDate = new Date(year, month - 1, day).toISOString();
        return {
          year: parseInt(item.year),
          dueDate: dueDate,
          status: item.status,
          tfn: item.TFN.toString().trim(),
          dbPrefix: item.db_prefix,
        };
      }),
    });
    console.log('Yearly data inserted successfully:', result);
  } catch (error) {
    console.error('Error inserting yearly data:', error);
  }
}
