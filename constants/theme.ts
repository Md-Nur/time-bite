export const Colors = {
  primary: '#1A73E8', // Google Blue
  secondary: '#34A853', // Google Green
  accent: '#FBBC05', // Google Yellow
  error: '#EA4335', // Google Red
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#202124',
  textSecondary: '#5F6368',
  border: '#DADCE0',
  shadow: 'rgba(60, 64, 67, 0.3)',
  
  // Soft variations for cards
  cardBlue: '#E8F0FE',
  cardGreen: '#E6F4EA',
  cardYellow: '#FEF7E0',
  cardRed: '#FCE8E6',
  cardPink: '#FEEFC3',
  cardPurple: '#F3E5F5',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    color: Colors.text,
  },
  caption: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
};
