const errorHandler = require("../middlewares/errorHandler");
const authRouter = require("./auth");
const checklistRouter = require("./checklist");
const collaboratorRouter = require("./collaborator");
const historyRouter = require("./history");
const noteRouter = require("./note");
const noteTagRouter = require("./noteTag");
const remindRouter = require("./remind");
const tagRouter = require("./tag");
const userRouter = require("./user");
const imageNoteRouter = require("./imageNote");
const CustomError = require("../ultities/CustomError");

const initRoutes = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/notes", noteRouter);
  app.use("/api/v1/reminders", remindRouter);
  app.use("/api/v1/tags", tagRouter);
  app.use("/api/v1/noteTags", noteTagRouter);
  app.use("/api/v1/histories", historyRouter);
  app.use("/api/v1/checklists", checklistRouter);
  app.use("/api/v1/collaborators", collaboratorRouter);
  app.use("/api/v1/images", imageNoteRouter);

  // Middleware xử lý 404
  app.use((req, res, next) => {
    throw new CustomError(`Note find route: ${req.originalUrl}`, 404, 1);
  });

  // Middleware xử lý lỗi
  app.use(errorHandler);

  return app.use("/", (req, res) => {
    res.send("Server on...");
  });
};

module.exports = initRoutes;
