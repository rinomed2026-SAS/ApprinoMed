// Tipos para la sección Comunidad RINOMED
export type CommunitySubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type CommunitySubmission = {
  id: string;
  userName: string;
  originalImageUrl: string;
  composedImageUrl?: string | null;
  allowGallery: boolean;
  status: CommunitySubmissionStatus;
  createdAt: string;
  updatedAt: string;
};

export type CommunityGalleryItem = {
  id: string;
  userName: string;
  composedImageUrl: string;
  createdAt: string;
};

export type CreateCommunitySubmissionPayload = {
  userName: string;
  originalImageUrl: string;
  composedImageUrl?: string;
  allowGallery: boolean;
};
