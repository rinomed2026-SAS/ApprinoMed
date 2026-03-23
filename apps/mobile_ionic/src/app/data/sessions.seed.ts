import { Session } from '../services/types';

export type SessionSeed = Session & { speakers: string[] };

export const SESSIONS_SEED: SessionSeed[] = [
  { id: 's1', day: '2026-04-17', startTime: '08:30', endTime: '09:15', title: 'Functional Rhinology Update', topic: 'Rhinology', level: 'Conference', room: 'Auditorium A', description: 'Advances in functional nasal surgery.', speakers: ['Dr. Ruiz'], isFavorite: true },
  { id: 's2', day: '2026-04-17', startTime: '09:30', endTime: '10:15', title: 'Modern Hearing Rehab', topic: 'Otology', level: 'Conference', room: 'Auditorium A', description: 'Hearing implants and rehab pathways.', speakers: ['Dr. Kim'] },
  { id: 's3', day: '2026-04-17', startTime: '10:30', endTime: '11:15', title: 'Endoscopic Sinus Surgery Workshop', topic: 'Workshop', level: 'Hands-on', room: 'Workshop Room 1', description: 'Step-by-step endoscopic techniques.', speakers: ['Dr. Torres'] },
  { id: 's4', day: '2026-04-17', startTime: '11:30', endTime: '12:15', title: 'Pediatric Airway Pearls', topic: 'Airway', level: 'Conference', room: 'Auditorium B', description: 'Strategies for complex pediatric airway.', speakers: ['Dr. Silva'] },
  { id: 's5', day: '2026-04-17', startTime: '12:30', endTime: '13:15', title: 'Smell & Taste Disorders', topic: 'Rhinology', level: 'Conference', room: 'Auditorium B', description: 'Diagnosis and management updates.', speakers: ['Dr. López'] },
  { id: 's6', day: '2026-04-17', startTime: '14:00', endTime: '14:45', title: 'Skull Base Safety', topic: 'Skull Base', level: 'Conference', room: 'Auditorium A', description: 'Complication avoidance in skull base.', speakers: ['Dr. Ahmed'] },
  { id: 's7', day: '2026-04-17', startTime: '15:00', endTime: '15:45', title: 'Voice Clinic 2026', topic: 'Laryngology', level: 'Conference', room: 'Auditorium C', description: 'Voice outcomes and new tech.', speakers: ['Dr. Gómez'] },
  { id: 's8', day: '2026-04-17', startTime: '16:00', endTime: '16:45', title: 'AI in Otolaryngology', topic: 'Innovation', level: 'Conference', room: 'Auditorium C', description: 'AI tools for diagnostics and planning.', speakers: ['Dr. Chen'] },
  { id: 's9', day: '2026-04-17', startTime: '17:00', endTime: '17:45', title: 'Allergy for Surgeons', topic: 'Allergy', level: 'Conference', room: 'Auditorium B', description: 'Immunotherapy essentials.', speakers: ['Dr. Patel'] },
  { id: 's10', day: '2026-04-17', startTime: '18:00', endTime: '18:45', title: 'Dizziness Simplified', topic: 'Otology', level: 'Conference', room: 'Auditorium A', description: 'Vestibular algorithms.', speakers: ['Dr. Rivera'] },
  { id: 's11', day: '2026-04-17', startTime: '19:00', endTime: '19:45', title: 'Facial Plastics Update', topic: 'Facial Plastics', level: 'Conference', room: 'Auditorium C', description: 'Refinements in rhinoplasty.', speakers: ['Dr. Brown'] },
  { id: 's12', day: '2026-04-17', startTime: '20:00', endTime: '20:45', title: 'Sleep Surgery Pathways', topic: 'Sleep', level: 'Conference', room: 'Auditorium B', description: 'OSA surgical decision-making.', speakers: ['Dr. Singh'] },
  { id: 's13', day: '2026-04-18', startTime: '08:30', endTime: '09:15', title: 'Sinonasal Tumors Panel', topic: 'Oncology', level: 'Conference', room: 'Auditorium A', description: 'Multidisciplinary cases.', speakers: ['Dr. Silva'] },
  { id: 's14', day: '2026-04-18', startTime: '09:30', endTime: '10:15', title: 'Hearing in Pediatrics', topic: 'Otology', level: 'Conference', room: 'Auditorium A', description: 'Screening to implants.', speakers: ['Dr. Kim'] },
  { id: 's15', day: '2026-04-18', startTime: '10:30', endTime: '11:15', title: 'Balloon vs ESS Debate', topic: 'Rhinology', level: 'Debate', room: 'Auditorium B', description: 'Evidence and selection.', speakers: ['Dr. Ahmed'] },
  { id: 's16', day: '2026-04-18', startTime: '11:30', endTime: '12:15', title: 'Advanced Airway Simulation', topic: 'Airway', level: 'Workshop', room: 'Simulation Lab', description: 'Hands-on airway crisis.', speakers: ['Dr. Torres'] },
  { id: 's17', day: '2026-04-18', startTime: '12:30', endTime: '13:15', title: 'HHT Epistaxis Solutions', topic: 'Rhinology', level: 'Conference', room: 'Auditorium C', description: 'Embolization and laser.', speakers: ['Dr. Brown'] },
  { id: 's18', day: '2026-04-18', startTime: '14:00', endTime: '14:45', title: 'Head & Neck Reconstruction', topic: 'Oncology', level: 'Conference', room: 'Auditorium A', description: 'Flaps and function.', speakers: ['Dr. Patel'] },
  { id: 's19', day: '2026-04-18', startTime: '15:00', endTime: '15:45', title: '3D Printing for ENT', topic: 'Innovation', level: 'Conference', room: 'Auditorium B', description: 'Custom implants and guides.', speakers: ['Dr. Chen'] },
  { id: 's20', day: '2026-04-18', startTime: '16:00', endTime: '16:45', title: 'Otology Case Theater', topic: 'Otology', level: 'Panel', room: 'Auditorium B', description: 'Challenging ear cases.', speakers: ['Dr. Rivera'] },
  { id: 's21', day: '2026-04-18', startTime: '17:00', endTime: '17:45', title: 'Voice Lab Live', topic: 'Laryngology', level: 'Workshop', room: 'Workshop Room 2', description: 'Live stroboscopy demo.', speakers: ['Dr. Gómez'] },
  { id: 's22', day: '2026-04-18', startTime: '18:00', endTime: '18:45', title: 'Sleep Hypoglossal Nerve', topic: 'Sleep', level: 'Conference', room: 'Auditorium C', description: 'Inspire and beyond.', speakers: ['Dr. Singh'] },
  { id: 's23', day: '2026-04-18', startTime: '19:00', endTime: '19:45', title: 'Closing Keynote', topic: 'Leadership', level: 'Keynote', room: 'Auditorium A', description: 'Future of ENT.', speakers: ['Dr. Ruiz'] }
];
