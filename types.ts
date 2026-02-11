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
}

export interface GenerationOptions {
  useThinking: boolean;
  useLite: boolean;
  image?: string;
}

export enum AppMode {
  Chat = 'chat',
  Settings = 'settings'
}
