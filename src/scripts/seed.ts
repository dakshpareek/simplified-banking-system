import bcrypt from "bcrypt";
import "dotenv/config";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected!");

    const userRepository = AppDataSource.getRepository(User);
    const seedUsers = [
      { email: "alice@example.com", pin: 1234, balance: 1000 },
      { email: "bob@example.com", pin: 5678, balance: 500 },
    ];

    for (const seedUser of seedUsers) {
      if (await userRepository.findOneBy({ email: seedUser.email })) {
        console.log(`User with email ${seedUser.email} already exists, skipping...`);
        continue;
      }
      const user = new User();
      user.email = seedUser.email;
      user.pinHash = bcrypt.hashSync(seedUser.pin.toString(), 10);
      user.balance = seedUser.balance;
      await userRepository.save(user);
    }
    console.log("Seeding completed!");
  } catch (err) {
    console.error("Error during Data Source initialization:", err);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
