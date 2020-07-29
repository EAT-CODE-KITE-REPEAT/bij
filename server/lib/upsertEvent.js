const { publicUserFields } = require("./util");

const upsertEvent = async (req, res, sequelize, User, Event) => {
  const { id, token, title, date, description, maxParticipants } = req.body;

  if (!token) {
    res.json({ response: "No token given" });
    return;
  }

  const user = await User.findOne({
    attributes: publicUserFields,
    where: { loginToken: token },
  });

  if (!user) {
    res.json({ response: "User not found" });
    return;
  }
  let already;
  if (id) {
    already = await Event.findOne({ where: { id, userId: user.id } });
  }
  let event;
  if (already) {
    //update
    await Event.update(
      { title, date, description, maxParticipants },
      { where: { id } }
    );
    event = await Event.findOne({ where: { id } });
  } else {
    event = await Event.create({
      title,
      date,
      description,
      maxParticipants,
      userId: user.id,
    });
  }

  res.json({ response: event });
};

module.exports = {
  upsertEvent,
};
