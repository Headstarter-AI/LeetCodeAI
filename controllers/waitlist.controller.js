import { WaitListUser } from "../models/waitlist.models.js";
const waitListUser = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const existUser = await WaitListUser.findOne({ email });
    console.log(existUser);

    if (!existUser) {
      const waitListUser = await WaitListUser.create({
        email,
      });
      await waitListUser.save();
      res.status(200).json({ status: "ok", message: "You are waitlisted" });
    } else {
      res
        .status(400)
        .json({ status: "400", message: "You are already registered" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        status: "500",
        message: `Something went wrong: ${error.message}`,
      });
  }
};

export { waitListUser };
