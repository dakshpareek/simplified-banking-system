import bcrypt from "bcrypt";
import "dotenv/config";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

const INR_PAISE_PER_RUPEE = 100;

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected!");

    const userRepository = AppDataSource.getRepository(User);
    const seedUsers = [
      { email: "alice@example.com", pin: 1234, balanceRupees: 1000 },
      { email: "bob@example.com", pin: 5678, balanceRupees: 500 },
    ];

    for (const seedUser of seedUsers) {
      if (await userRepository.findOneBy({ email: seedUser.email })) {
        console.log(`User with email ${seedUser.email} already exists, skipping...`);
        continue;
      }
      const user = new User();
      user.email = seedUser.email;
      user.pinHash = bcrypt.hashSync(seedUser.pin.toString(), 10);
      user.balanceInMinorUnits = seedUser.balanceRupees * INR_PAISE_PER_RUPEE;
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
