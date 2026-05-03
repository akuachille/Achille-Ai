export enum Sender {
  User = 'user',
  Bot = 'bot'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  image?: string; // Base64 string
  isThinking?: boolean;
  sources?: { title: string; url: string }[];
}

export interface GenerationOptions {
  useThinking: boolean;
  useLite: boolean;
  useSearch?: boolean;
  useCode?: boolean;
  image?: string;
}

export enum AppMode {
  Chat = 'chat',
  Settings = 'settings'
}
