import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import User from './models/userModel.js'; // Adjust the path to your User model


const deleteUsersMany = async()=>{
  try {
    await mongoose.connect('mongodb+srv://nafitha1993:fptc4Ede6kjJFDNc@eshop.uqdktjs.mongodb.net/?retryWrites=true&w=majority&appName=eshop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const userToDelete = await User.find().sort({createdAt:-1}).limit(10)
    if(userToDelete.length === 0){
      console.log('no users to delete')
      return
    }
    const userIds = userToDelete.map((user)=>user._id)
    await User.deleteMany({_id:{$in:userIds}})
    console.log('deleted 10 last users')
      await mongoose.connection.close()
  }catch(error){
    console.error('error deleting users')
  }
}
const generateFakeUsers = async (numUsers) => {
  try {
    await mongoose.connect('mongodb+srv://nafitha1993:fptc4Ede6kjJFDNc@eshop.uqdktjs.mongodb.net/?retryWrites=true&w=majority&appName=eshop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = [];
    const password = 'user1234';
    const existingEmails = new Set();

    for (let i = 0; i < numUsers; i++) {
      let email;
      do {
        email = faker.internet.email();
      } while (existingEmails.has(email));

      existingEmails.add(email);

      const user = {
        provider: 'email',
        name: faker.person.firstName(),
        email: email,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        profilePhoto: faker.image.avatar(),
        password,
        isAdmin: faker.datatype.boolean(),
        wishList: [],
      };
      users.push(user);
      console.log(users)
    }
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    try {
      await User.insertMany(users);
      console.log(`${numUsers} fake users generated successfully!`);
    } catch (error) {
      console.error('Error inserting users:', error);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error generating fake users:', error);
  }
};

// Generate 20 fake users
generateFakeUsers(10);
//deleteUsersMany()


