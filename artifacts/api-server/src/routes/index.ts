import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import blogsRouter from "./blogs";
import settingsRouter from "./settings";
import enquiriesRouter from "./enquiries";
import testimonialsRouter from "./testimonials";
import heroSlidesRouter from "./hero-slides";
import videosRouter from "./videos";
import visitorsRouter from "./visitors";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(uploadRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(blogsRouter);
router.use(settingsRouter);
router.use(enquiriesRouter);
router.use(testimonialsRouter);
router.use(heroSlidesRouter);
router.use(videosRouter);
router.use(visitorsRouter);

export default router;
