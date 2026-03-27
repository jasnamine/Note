const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const db = require("./src/models");
const passport = require("passport");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, cb) => {
      // Thêm user vào database
      try {
        const { id: googleId, emails, displayName: fullname } = profile;
        const email = emails[0].value;

        // Tìm user bằng googleId
        let user = await db.User.findOne({ where: { googleId } });

        // Nếu không có, tìm bằng email và cập nhật googleId.
        if (!user) {
          user = await db.User.findOne({ where: { email } });
          if (user) {
            user.googleId = googleId;
            await user.save();
          }

          // Nếu chưa tồn tại, tạo user mới với username từ email, không cần password.
          else {
            user = await db.User.create({
              email,
              fullname,
              googleId,
              username: email.split("@")[0],
              password: "",
              settings: { language: "en", theme: "light" },
            });
          }
        }


        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

module.exports = passport;
