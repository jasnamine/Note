const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

(async () => {
  try {
    await client.connect();
    console.log("Redis connected");

    client.ping().then((pong) => {
      console.log("Ping response:", pong);
    });

    client.on("ready", () => console.log("Redis is ready"));
    client.on("error", (err) => console.error("Redis Error:", err));
  } catch (error) {
    console.error("Redis connection error:", error);
  }
})();

module.exports = client;

