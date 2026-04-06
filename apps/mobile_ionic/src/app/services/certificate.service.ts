import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { Certificate } from './types';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  constructor(
    private api: ApiService,
    private storage: StorageService
  ) {}

  // Fetch certificate metadata (JSON)
  getCertificate() {
    return this.api.get<{ data: Certificate }>('/v1/certificate');
  }

  // Download PDF file
  downloadPdf() {
    return this.api.getBlob('/v1/certificate/pdf');
  }

  // Legacy blob method
  download() {
    return this.api.getBlob('/v1/certificate/pdf');
  }

  // Cache certificate data
  async cacheCertificate(certificate: Certificate) {
    await this.storage.set('certificate', certificate);
  }

  // Get cached certificate
  async getCachedCertificate(): Promise<Certificate | null> {
    return await this.storage.get<Certificate>('certificate');
  }
}
