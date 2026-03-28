const cron = require("node-cron");
const remindService = require("../services/remindService");

const sendReminderJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await remindService.sendEmailRemind();
    } catch (err) {
      console.error("Cron job execution failed:", err);
    }
  });
};

module.exports = { sendReminderJob };
