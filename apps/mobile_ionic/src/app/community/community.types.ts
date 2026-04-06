// Tipos para la sección Comunidad RINOMED
export type CommunitySubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type CommunitySubmission = {
  id: string;
  userName: string;
  originalImageUrl: string;
  composedImageUrl?: string | null;
  allowGallery: boolean;
  appCaption?: string | null;
  status: CommunitySubmissionStatus;
  createdAt: string;
  updatedAt: string;
};

export type CommunityGalleryItem = {
  id: string;
  userName: string;
  composedImageUrl: string;
  appCaption?: string | null;
  createdAt: string;
};

export type CreateCommunitySubmissionPayload = {
  userName: string;
  originalImageUrl: string;
  composedImageUrl?: string;
  allowGallery: boolean;
  appCaption?: string;
};
