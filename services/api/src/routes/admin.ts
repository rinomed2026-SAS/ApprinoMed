import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { hashPassword } from '../lib/auth.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { toCsv } from '../lib/csv.js';
import { syncUsersFromSheet } from '../lib/sync-users.js';

export const adminRouter = Router();


adminRouter.use(requireAuth, requireRole('ADMIN'));

// POST /v1/admin/sync-users — Sync registrants from Google Sheet to DB
adminRouter.post('/sync-users', async (_req, res, next) => {
  try {
    const stats = await syncUsersFromSheet();
    res.json({ ok: true, data: stats });
  } catch (error) {
    next(error);
  }
});

const sessionSchema = z.object({
  day: z.string().min(1, 'Day is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  room: z.string().min(1, 'Room is required'),
  title: z.string().min(1, 'Title is required'),
  topic: z.string().min(1, 'Topic is required'),
  level: z.string().min(1, 'Level is required'),
  description: z.string().optional().default(''),
  speakerIds: z.array(z.string()).optional()
});

adminRouter.get('/sessions', async (_req, res, next) => {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
      include: { speakers: { include: { speaker: true } } }
    });
    const data = sessions.map((s) => ({
      ...s,
      speakers: s.speakers.map((link) => link.speaker)
    }));
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/sessions', async (req, res, next) => {
  try {
    const { speakerIds, ...data } = sessionSchema.parse(req.body);
    const session = await prisma.session.create({
      data: {
        ...data,
        day: new Date(data.day),
        ...(speakerIds?.length ? { speakers: { create: speakerIds.map((id) => ({ speakerId: id })) } } : {})
      },
      include: { speakers: { include: { speaker: true } } }
    });
    res.status(201).json({ data: { ...session, speakers: session.speakers.map((l) => l.speaker) } });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/sessions/:id', async (req, res, next) => {
  try {
    const { speakerIds, ...data } = sessionSchema.parse(req.body);
    // Update session fields
    const session = await prisma.session.update({
      where: { id: req.params.id },
      data: { ...data, day: new Date(data.day) }
    });
    // Replace speaker links if provided
    if (speakerIds) {
      await prisma.sessionSpeaker.deleteMany({ where: { sessionId: req.params.id } });
      if (speakerIds.length) {
        await prisma.sessionSpeaker.createMany({
          data: speakerIds.map((speakerId) => ({ sessionId: req.params.id, speakerId }))
        });
      }
    }
    const full = await prisma.session.findUnique({
      where: { id: req.params.id },
      include: { speakers: { include: { speaker: true } } }
    });
    res.json({ data: { ...full, speakers: full!.speakers.map((l) => l.speaker) } });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/sessions/:id', async (req, res, next) => {
  try {
    await prisma.session.delete({ where: { id: req.params.id } });
    res.json({ message: 'Session deleted' });
  } catch (error) {
    next(error);
  }
});

// Link a speaker to a session
adminRouter.post('/sessions/:sessionId/speakers/:speakerId', async (req, res, next) => {
  try {
    await prisma.sessionSpeaker.create({
      data: { sessionId: req.params.sessionId, speakerId: req.params.speakerId }
    });
    res.status(201).json({ message: 'Speaker linked to session' });
  } catch (error) {
    next(error);
  }
});

// Unlink a speaker from a session
adminRouter.delete('/sessions/:sessionId/speakers/:speakerId', async (req, res, next) => {
  try {
    await prisma.sessionSpeaker.delete({
      where: { sessionId_speakerId: { sessionId: req.params.sessionId, speakerId: req.params.speakerId } }
    });
    res.json({ message: 'Speaker unlinked from session' });
  } catch (error) {
    next(error);
  }
});

const speakerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  country: z.string().min(1, 'Country is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  bio: z.string().optional().default(''),
  photoUrl: z.string().optional().default('https://placehold.co/300x300'),
  websiteUrl: z.string().optional().default(''),
  instagramUrl: z.string().optional().default('')
});

adminRouter.get('/speakers', async (_req, res, next) => {
  try {
    const speakers = await prisma.speaker.findMany({ orderBy: { name: 'asc' } });
    res.json({ data: speakers });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/speakers', async (req, res, next) => {
  try {
    const data = speakerSchema.parse(req.body);
    const speaker = await prisma.speaker.create({ data });
    res.status(201).json({ data: speaker });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/speakers/:id', async (req, res, next) => {
  try {
    const data = speakerSchema.parse(req.body);
    const speaker = await prisma.speaker.update({ where: { id: req.params.id }, data });
    res.json({ data: speaker });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/speakers/:id', async (req, res, next) => {
  try {
    await prisma.speaker.delete({ where: { id: req.params.id } });
    res.json({ message: 'Speaker deleted' });
  } catch (error) {
    next(error);
  }
});

const sponsorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tier: z.string().min(1, 'Tier is required'),
  description: z.string().optional().default(''),
  websiteUrl: z.string().optional().default(''),
  products: z.string().optional().default('')
});

adminRouter.get('/sponsors', async (_req, res, next) => {
  try {
    const sponsors = await prisma.sponsor.findMany({ orderBy: { tier: 'asc' } });
    res.json({ data: sponsors });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/sponsors', async (req, res, next) => {
  try {
    const data = sponsorSchema.parse(req.body);
    const sponsor = await prisma.sponsor.create({ data });
    res.status(201).json({ data: sponsor });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/sponsors/:id', async (req, res, next) => {
  try {
    const data = sponsorSchema.parse(req.body);
    const sponsor = await prisma.sponsor.update({ where: { id: req.params.id }, data });
    res.json({ data: sponsor });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/sponsors/:id', async (req, res, next) => {
  try {
    await prisma.sponsor.delete({ where: { id: req.params.id } });
    res.json({ message: 'Sponsor deleted' });
  } catch (error) {
    next(error);
  }
});

const hotelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rating: z.number().optional().default(0),
  priceMinCop: z.number().optional().default(0),
  priceMaxCop: z.number().optional().default(0),
  distanceKm: z.number().optional().default(0),
  amenities: z.string().optional().default(''),
  contact: z.string().optional().default(''),
  promoCode: z.string().optional().default('')
});

adminRouter.get('/hotels', async (_req, res, next) => {
  try {
    const hotels = await prisma.hotel.findMany({ orderBy: { rating: 'desc' } });
    res.json({ data: hotels });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/hotels', async (req, res, next) => {
  try {
    const data = hotelSchema.parse(req.body);
    const hotel = await prisma.hotel.create({ data });
    res.status(201).json({ data: hotel });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/hotels/:id', async (req, res, next) => {
  try {
    const data = hotelSchema.parse(req.body);
    const hotel = await prisma.hotel.update({ where: { id: req.params.id }, data });
    res.json({ data: hotel });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/hotels/:id', async (req, res, next) => {
  try {
    await prisma.hotel.delete({ where: { id: req.params.id } });
    res.json({ message: 'Hotel deleted' });
  } catch (error) {
    next(error);
  }
});

const tourismSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  duration: z.string().optional().default(''),
  highlights: z.string().optional().default(''),
  description: z.string().optional().default('')
});

adminRouter.get('/tourism', async (_req, res, next) => {
  try {
    const tourism = await prisma.tourism.findMany({ orderBy: { name: 'asc' } });
    res.json({ data: tourism });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/tourism', async (req, res, next) => {
  try {
    const data = tourismSchema.parse(req.body);
    const item = await prisma.tourism.create({ data });
    res.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/tourism/:id', async (req, res, next) => {
  try {
    const data = tourismSchema.parse(req.body);
    const item = await prisma.tourism.update({ where: { id: req.params.id }, data });
    res.json({ data: item });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/tourism/:id', async (req, res, next) => {
  try {
    await prisma.tourism.delete({ where: { id: req.params.id } });
    res.json({ message: 'Tourism deleted' });
  } catch (error) {
    next(error);
  }
});

const eventInfoSchema = z.object({
  name: z.string(),
  city: z.string(),
  dates: z.string(),
  venue: z.string(),
  address: z.string(),
  email: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  website: z.string(),
  mapsUrl: z.string(),
  academicHours: z.string()
});

adminRouter.put('/event-info', async (req, res, next) => {
  try {
    const data = eventInfoSchema.parse(req.body);
    const info = await prisma.eventInfo.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data }
    });
    res.json({ data: info });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/questions/export.csv', async (_req, res, next) => {
  try {
    const questions = (await prisma.question.findMany({
      include: { session: true, user: true },
      orderBy: { createdAt: 'desc' }
    })) as Array<{
      id: string;
      text: string;
      anonymous: boolean;
      createdAt: Date;
      user: { email: string };
      session: { title: string };
    }>;
    const csv = toCsv(
      questions.map((q) => ({
        id: q.id,
        user: q.user.email,
        session: q.session.title,
        text: q.text,
        anonymous: q.anonymous ? 'Sí' : 'No',
        createdAt: q.createdAt.toISOString()
      }))
    );
    res.type('text/csv').send(csv);
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/questions', async (_req, res, next) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        session: { select: { id: true, title: true, day: true, startTime: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: questions });
  } catch (error) {
    next(error);
  }
});

// DELETE /v1/admin/questions/:id – admin: delete a question
adminRouter.delete('/questions/:id', async (_req, res, next) => {
  try {
    await prisma.question.delete({ where: { id: _req.params.id } });
    res.json({ message: 'Pregunta eliminada' });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/leads/export.csv', async (_req, res, next) => {
  try {
    const leads = (await prisma.sponsorLead.findMany({
      include: { user: true, sponsor: true },
      orderBy: { createdAt: 'desc' }
    })) as Array<{
      id: string;
      createdAt: Date;
      user: { email: string };
      sponsor: { name: string };
    }>;
    const csv = toCsv(
      leads.map((lead) => ({
        id: lead.id,
        user: lead.user.email,
        sponsor: lead.sponsor.name,
        createdAt: lead.createdAt.toISOString()
      }))
    );
    res.type('text/csv').send(csv);
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/users', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
});

const userRole = z.enum(['ASSISTANT', 'ASSISTANT_SURGICAL', 'ASSISTANT_VIRTUAL', 'SPEAKER', 'COMMITTEE', 'STAFF', 'SPONSOR', 'ADMIN']);
const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  role: userRole,
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: userRole.optional(),
  password: z.string().min(6).optional()
});

adminRouter.post('/users', async (req, res, next) => {
  try {
    const data = userCreateSchema.parse(req.body);
    const { password, ...rest } = data;
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { ...rest, passwordHash } });
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/users/:id', async (req, res, next) => {
  try {
    const data = userUpdateSchema.parse(req.body);
    const { password, ...rest } = data;
    const updateData: any = { ...rest };
    if (password) {
      updateData.passwordHash = await hashPassword(password);
    }
    const user = await prisma.user.update({ where: { id: req.params.id }, data: updateData });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/users/:id', async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
});

/* ─── Survey results ──────────────────────────────────────────────── */

adminRouter.get('/surveys', async (_req, res, next) => {
  try {
    const surveys = await prisma.surveyResponse.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });

    // Compute averages
    const count = surveys.length;
    const avg = (field: 'overallRating' | 'contentRating' | 'organizationRating' | 'venueRating') =>
      count > 0 ? +(surveys.reduce((sum, s) => sum + s[field], 0) / count).toFixed(1) : 0;

    const recommendCount = surveys.filter((s) => s.wouldRecommend).length;

    res.json({
      data: surveys,
      stats: {
        total: count,
        overallAvg: avg('overallRating'),
        contentAvg: avg('contentRating'),
        organizationAvg: avg('organizationRating'),
        venueAvg: avg('venueRating'),
        recommendPct: count > 0 ? Math.round((recommendCount / count) * 100) : 0
      }
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/surveys/export.csv', async (_req, res, next) => {
  try {
    const surveys = (await prisma.surveyResponse.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    })) as Array<{
      id: string;
      overallRating: number;
      contentRating: number;
      organizationRating: number;
      venueRating: number;
      wouldRecommend: boolean;
      comments: string | null;
      createdAt: Date;
      user: { email: string; name: string };
    }>;
    const csv = toCsv(
      surveys.map((s) => ({
        id: s.id,
        user: s.user.email,
        name: s.user.name,
        overall: s.overallRating,
        content: s.contentRating,
        organization: s.organizationRating,
        venue: s.venueRating,
        recommend: s.wouldRecommend ? 'Sí' : 'No',
        comments: s.comments ?? '',
        createdAt: s.createdAt.toISOString()
      }))
    );
    res.type('text/csv').send(csv);
  } catch (error) {
    next(error);
  }
});
