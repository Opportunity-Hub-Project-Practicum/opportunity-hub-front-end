export interface FormData {
  logo: File | null;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  companyName: string;
  aboutUs: string;
  organizationType: string;
  industryTypes: string;
  teamSize: string;
  yearOfEstablishment: string;
  companyWebsite: string;
  companyVision: string;
  mapLocation: string;
  phone: string;
  email: string;
}
