import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import blogsRouter from "./blogs";
import settingsRouter from "./settings";
import uploadRouter from "./upload";
import enquiriesRouter from "./enquiries";
import heroSlidesRouter from "./hero-slides";
import videoItemsRouter from "./video-items";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(uploadRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(blogsRouter);
router.use(settingsRouter);
router.use(enquiriesRouter);
router.use(heroSlidesRouter);
router.use(videoItemsRouter);

export default router;
