import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const surveyRouter = Router();

surveyRouter.use(requireAuth);

/** GET /v1/survey — check if user has submitted the survey */
surveyRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const existing = await prisma.surveyResponse.findUnique({
      where: { userId: req.user!.id }
    });
    return res.json({ data: existing });
  } catch (error) {
    return next(error);
  }
});

/** POST /v1/survey — submit satisfaction survey */
surveyRouter.post('/', async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      overallRating: z.number().min(1).max(5),
      contentRating: z.number().min(1).max(5),
      organizationRating: z.number().min(1).max(5),
      venueRating: z.number().min(1).max(5),
      wouldRecommend: z.boolean(),
      comments: z.string().optional()
    });
    const data = schema.parse(req.body);

    // Upsert — user can update their survey
    const survey = await prisma.surveyResponse.upsert({
      where: { userId: req.user!.id },
      create: { userId: req.user!.id, ...data },
      update: data
    });

    return res.status(201).json({ data: survey });
  } catch (error) {
    return next(error);
  }
});
