/**
 * Brighter Days App Color Palette
 * A calming, trustworthy, family-friendly color scheme designed for parents 
 * of children with autism.
 */

// Main brand colors
const primaryColor = '#73C2FB';     // Soft Sky Blue
const accentColor = '#FFD966';      // Warm Yellow (Sunny's vibe)
const calmTeal = '#3CBFAE';         // Calm Teal for buttons/CTAs
const backgroundLight = '#FFFDF7';  // Cream White
const backgroundDark = '#2D2D2D';   // Dark mode background

export const Colors = {
  light: {
    // Main colors
    primary: primaryColor,
    accent: accentColor,
    background: backgroundLight,
    tint: primaryColor,
    card: '#FFFFFF',
    
    // Text colors
    text: '#2D2D2D',                // Deep Charcoal
    textSecondary: '#6E6E6E',       // Muted Gray
    
    // UI elements
    button: calmTeal,
    border: '#E1E1E1',
    input: '#F5F5F5',
    
    // Tab navigation
    tabIconDefault: '#6E6E6E',
    tabIconSelected: primaryColor,
    
    // Feedback colors
    success: '#A3E4D7',             // Soft Green
    error: '#F28B82',               // Soft Coral
    warning: '#FFE082',             // Soft Amber
    
    // Transparency variants
    transparentPrimary: 'rgba(115, 194, 251, 0.2)',
    transparentAccent: 'rgba(255, 217, 102, 0.2)',
  },
  dark: {
    // Main colors
    primary: primaryColor,
    accent: accentColor,
    background: backgroundDark,
    tint: primaryColor,
    card: '#3A3A3A',
    
    // Text colors
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    
    // UI elements
    button: calmTeal,
    border: '#4A4A4A',
    input: '#3A3A3A',
    
    // Tab navigation
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryColor,
    
    // Feedback colors
    success: '#A3E4D7',
    error: '#F28B82',
    warning: '#FFE082',
    
    // Transparency variants
    transparentPrimary: 'rgba(115, 194, 251, 0.2)',
    transparentAccent: 'rgba(255, 217, 102, 0.2)',
  },
  
  // Common colors accessible regardless of theme
  common: {
    primary: primaryColor,
    accent: accentColor,
    teal: calmTeal,
    sunnyGradient: ['#FFD966', '#FFB347'],
    primaryGradient: [primaryColor, '#5BA3D0'],
    transparentPrimary: 'rgba(115, 194, 251, 0.2)',
    transparentAccent: 'rgba(255, 217, 102, 0.2)',
  }
};
