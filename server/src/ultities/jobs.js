const cron = require("node-cron");
const db = require("../models");
const remindService = require("../services/remindService");

const sendReminderJob = () => {
  cron.schedule("* * * * *", async () => {
    // console.log("=== Running reminder job ===");

    try {
      const users = await db.User.findAll({ attributes: ["id"] });

      for (const user of users) {
        try {
          await remindService.sendEmailRemind(user.id);
        } catch (err) {
          if (err.message !== "No reminders to send") {
            console.error(
              `Error processing reminders for user ${user.id}:`,
              err
            );
          }
        }
      }
    } catch (err) {
      console.error("Cron job failed:", err);
    }
  });
};

module.exports = { sendReminderJob };

// * * * * * *
// | | | | | |
// | | | | | └─ Thứ trong tuần (0 - 7) (Chủ nhật là 0 hoặc 7)
// | | | | └── Tháng (1 - 12)
// | | | └──── Ngày trong tháng (1 - 31)
// | | └────── Giờ (0 - 23)
// | └──────── Phút (0 - 59)
// └────────── Giây (0 - 59) (Node-cron yêu cầu có giây)
