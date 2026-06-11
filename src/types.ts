export interface Anniversary {
  id: string;
  name: string;
  month: number;
  day: number;
  isDoubleDay?: boolean; // For 6月21/22日 (夏至日)
  endDay?: number;
  description: string;
  themeColor: string; // Tailwind class color for accent (e.g. 'rose', 'pink', 'indigo', 'purple')
  bgColor: string; // Gradient bg start
  textColor: string;
  accentColor: string; // hex representation for canvas rendering
  iconName: string; // Name of Lucide icon
  funFacts: string[]; // Quotes, facts or ideas
  isCustom?: boolean; // user created
}

export interface TimeTravelState {
  isTravelActive: boolean;
  selectedMonth: number;
  selectedDay: number;
}
