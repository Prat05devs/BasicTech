export interface InquiryType {
  id: string;
  label: string;
  description?: string;
}

export const INQUIRY_TYPES: InquiryType[] = [
  { 
    id: 'entrepreneur', 
    label: 'Entrepreneur', 
    description: 'Building a new product or service'
  },
  { 
    id: 'startup', 
    label: 'Startup', 
    description: 'Early-stage company (0-50 employees)'
  },
  { 
    id: 'small-business', 
    label: 'Small Business', 
    description: 'Small business (1-50 employees)'
  },
  { 
    id: 'medium-business', 
    label: 'Medium Business', 
    description: 'Growing business (51-250 employees)'
  },
  { 
    id: 'large-business', 
    label: 'Large Business', 
    description: 'Enterprise organization (250+ employees)'
  },
  { 
    id: 'organization', 
    label: 'Organization / Non-profit', 
    description: 'Non-profit or organizational entity'
  },
];

export const DEFAULT_INQUIRY_TYPE: InquiryType = INQUIRY_TYPES.find(t => t.id === 'startup') || INQUIRY_TYPES[1];
