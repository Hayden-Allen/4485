const mongoose = require("mongoose");
require("dotenv").config();

export default async (req, res) => {
  try {
    const conn = mongoose.createConnection(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@test.1fkmuj4.mongodb.net/test`
    );

    const Schema = mongoose.Schema;

    const kittenSchema = new Schema({ name: String });
    kittenSchema.methods.speak = function speak() {
      console.log(this.name);
    };
    const Kitten = conn.model("Kitten", kittenSchema);

    const test = new Kitten({ name: "Test" });
    await test.save();

    const list = await Kitten.find();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
};
