import { Router } from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const certificateRouter = Router();

/* ─── Role-based certificate configuration ─────────────────────────── */
type CertConfig = {
  titleEs: string;
  titleEn: string;
  subtitleEs: string;
  subtitleEn: string;
  hours: number;
  color: [number, number, number]; // RGB 0-1
};

const CERT_CONFIG: Record<string, CertConfig> = {
  /* ── 🧬 Académicos ─────────────────────────────────────────────── */
  ASSISTANT: {
    titleEs: 'Certificado de Asistente al Congreso',
    titleEn: 'Congress Attendance Certificate',
    subtitleEs: 'por su asistencia al',
    subtitleEn: 'for attending the',
    hours: 16,
    color: [0.75, 0.48, 0.72] // magenta
  },
  ASSISTANT_SURGICAL: {
    titleEs: 'Certificado de Asistente con Entrenamiento Quirúrgico',
    titleEn: 'Surgical Training Attendance Certificate',
    subtitleEs: 'por su asistencia con entrenamiento quirúrgico al',
    subtitleEn: 'for attending with surgical training the',
    hours: 24,
    color: [0.80, 0.30, 0.35] // red
  },
  ASSISTANT_VIRTUAL: {
    titleEs: 'Certificado de Asistente Virtual',
    titleEn: 'Virtual Attendance Certificate',
    subtitleEs: 'por su asistencia virtual al',
    subtitleEn: 'for virtually attending the',
    hours: 12,
    color: [0.45, 0.65, 0.85] // light blue
  },
  SPEAKER: {
    titleEs: 'Certificado de Conferencista',
    titleEn: 'Speaker Certificate',
    subtitleEs: 'por su participación como conferencista en el',
    subtitleEn: 'for participating as a speaker at the',
    hours: 20,
    color: [0.30, 0.52, 0.80] // blue
  },
  /* ── 🏛️ Institucionales ────────────────────────────────────────── */
  COMMITTEE: {
    titleEs: 'Certificado de Miembro del Comité Organizador',
    titleEn: 'Organizing Committee Member Certificate',
    subtitleEs: 'por su labor como miembro del comité organizador del',
    subtitleEn: 'for serving as organizing committee member of the',
    hours: 24,
    color: [0.85, 0.62, 0.20] // gold
  },
  STAFF: {
    titleEs: 'Certificado de Staff Logístico',
    titleEn: 'Logistics Staff Certificate',
    subtitleEs: 'por su labor logística en el',
    subtitleEn: 'for logistics support at the',
    hours: 24,
    color: [0.28, 0.68, 0.42] // green
  },
  SPONSOR: {
    titleEs: 'Certificado de Patrocinador Oficial',
    titleEn: 'Official Sponsor Certificate',
    subtitleEs: 'por su patrocinio oficial del',
    subtitleEn: 'for officially sponsoring the',
    hours: 0,
    color: [0.55, 0.35, 0.75] // purple
  },
  ADMIN: {
    titleEs: 'Certificado de Dirección',
    titleEn: 'Director Certificate',
    subtitleEs: 'por su dirección del',
    subtitleEn: 'for directing the',
    hours: 24,
    color: [0.85, 0.62, 0.20] // gold
  }
};

/* ─── GET /v1/certificate  — metadata (JSON) ──────────────────────── */
certificateRouter.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the user has completed the satisfaction survey
    const survey = await prisma.surveyResponse.findUnique({ where: { userId: req.user!.id } });
    if (!survey) {
      return res.status(403).json({ message: 'SURVEY_REQUIRED', surveyCompleted: false });
    }

    const cfg = CERT_CONFIG[user.role] ?? CERT_CONFIG.ASSISTANT;
    const eventInfo = await prisma.eventInfo.findFirst();
    const validationCode = `RINO-${user.role.slice(0, 3)}-${user.id.slice(0, 8).toUpperCase()}`;

    return res.json({
      data: {
        id: '1',
        userId: user.id,
        certificateId: validationCode,
        userName: user.name,
        userRole: user.role,
        certificateType: cfg.titleEs,
        eventName: eventInfo?.name ?? 'Congreso Internacional de Rinología y Otorrinolaringología — RINOMED 2026',
        eventDates: '17–18 de abril de 2026',
        academicHours: cfg.hours,
        issuedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return next(error);
  }
});

/* ─── GET /v1/certificate/pdf — downloadable PDF ──────────────────── */
certificateRouter.get('/pdf', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const survey = await prisma.surveyResponse.findUnique({ where: { userId: req.user!.id } });
    if (!survey) {
      return res.status(403).json({ message: 'SURVEY_REQUIRED', surveyCompleted: false });
    }

    const cfg = CERT_CONFIG[user.role] ?? CERT_CONFIG.ASSISTANT;
    const eventInfo = await prisma.eventInfo.findFirst();
    const eventName = eventInfo?.name ?? 'RINOMED 2026';
    const validationCode = `RINO-${user.role.slice(0, 3)}-${user.id.slice(0, 8).toUpperCase()}`;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // Landscape A4
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const accentColor = rgb(cfg.color[0], cfg.color[1], cfg.color[2]);
    const darkText = rgb(0.12, 0.12, 0.12);
    const grayText = rgb(0.4, 0.4, 0.4);

    // ── Border decoration ──
    page.drawRectangle({ x: 20, y: 20, width: 802, height: 555, borderColor: accentColor, borderWidth: 2, opacity: 0 });
    page.drawRectangle({ x: 28, y: 28, width: 786, height: 539, borderColor: accentColor, borderWidth: 0.5, opacity: 0 });

    // ── Header line ──
    page.drawRectangle({ x: 160, y: 530, width: 522, height: 3, color: accentColor });

    // ── Title ──
    const titleWidth = fontBold.widthOfTextAtSize(cfg.titleEs, 30);
    page.drawText(cfg.titleEs, {
      x: (842 - titleWidth) / 2,
      y: 495,
      size: 30,
      font: fontBold,
      color: darkText
    });

    // ── Subtitle ──
    const subText = `${cfg.subtitleEs}`;
    const subWidth = fontRegular.widthOfTextAtSize(subText, 14);
    page.drawText(subText, { x: (842 - subWidth) / 2, y: 460, size: 14, font: fontRegular, color: grayText });

    // ── Recipient name ──
    const nameWidth = fontBold.widthOfTextAtSize(user.name, 26);
    page.drawText(user.name, { x: (842 - nameWidth) / 2, y: 415, size: 26, font: fontBold, color: accentColor });

    // ── Decorative line under name ──
    page.drawRectangle({ x: 260, y: 408, width: 322, height: 1, color: accentColor });

    // ── Event name ──
    const evtText = eventName;
    const evtWidth = fontRegular.widthOfTextAtSize(evtText, 16);
    page.drawText(evtText, { x: (842 - evtWidth) / 2, y: 375, size: 16, font: fontRegular, color: darkText });

    // ── Event details ──
    const details = 'Medellín, Colombia · 17–18 de abril de 2026';
    const detWidth = fontRegular.widthOfTextAtSize(details, 12);
    page.drawText(details, { x: (842 - detWidth) / 2, y: 350, size: 12, font: fontRegular, color: grayText });

    // ── Academic hours ──
    const hoursText = `${cfg.hours} horas académicas`;
    const hoursWidth = fontBold.widthOfTextAtSize(hoursText, 14);
    page.drawText(hoursText, { x: (842 - hoursWidth) / 2, y: 320, size: 14, font: fontBold, color: darkText });

    // ── Cedula if available ──
    if (user.cedula) {
      const cedText = `Cédula/ID: ${user.cedula}`;
      const cedWidth = fontRegular.widthOfTextAtSize(cedText, 11);
      page.drawText(cedText, { x: (842 - cedWidth) / 2, y: 298, size: 11, font: fontRegular, color: grayText });
    }

    // ── Validation code ──
    const codeText = `Código de validación: ${validationCode}`;
    const codeWidth = fontItalic.widthOfTextAtSize(codeText, 10);
    page.drawText(codeText, { x: (842 - codeWidth) / 2, y: 270, size: 10, font: fontItalic, color: grayText });

    // ── Issue date ──
    const now = new Date();
    const dateStr = `Emitido el ${now.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    const dateWidth = fontRegular.widthOfTextAtSize(dateStr, 10);
    page.drawText(dateStr, { x: (842 - dateWidth) / 2, y: 250, size: 10, font: fontRegular, color: grayText });

    // ── QR code ──
    const qrDataUrl = await QRCode.toDataURL(validationCode, { width: 120 });
    const qrImage = await pdfDoc.embedPng(qrDataUrl);
    page.drawImage(qrImage, { x: 680, y: 50, width: 100, height: 100 });

    // ── Footer ──
    page.drawRectangle({ x: 160, y: 40, width: 522, height: 1, color: accentColor });
    const footerText = 'Congreso Internacional de Rinología y Otorrinolaringología';
    const footerWidth = fontRegular.widthOfTextAtSize(footerText, 9);
    page.drawText(footerText, { x: (842 - footerWidth) / 2, y: 26, size: 9, font: fontRegular, color: grayText });

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="RINOMED-2026-${user.role}-${validationCode}.pdf"`);
    return res.send(Buffer.from(pdfBytes));
  } catch (error) {
    return next(error);
  }
});
