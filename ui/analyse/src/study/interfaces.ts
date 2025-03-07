import * as cg from 'chessground/types';
import { Prop } from 'common';
import { AnalyseData } from '../interfaces';
import { GamebookOverride } from './gamebook/interfaces';
import { Opening } from '../explorer/interfaces';

export type Tab = 'intro' | 'members' | 'chapters';
export type ToolTab = 'tags' | 'comments' | 'glyphs' | 'serverEval' | 'share' | 'multiBoard';
export type RelayTab = 'overview' | 'schedule' | 'leaderboard';
export type Visibility = 'public' | 'unlisted' | 'private';

export interface StudyVm {
  loading: boolean;
  nextChapterId?: string;
  justSetChapterId?: string;
  tab: Prop<Tab>;
  toolTab: Prop<ToolTab>;
  chapterId: string;
  mode: {
    sticky: boolean;
    write: boolean;
  };
  behind: number;
  updatedAt: number;
  gamebookOverride: GamebookOverride;
}

export interface StudyData {
  id: string;
  name: string;
  members: StudyMemberMap;
  position: Position;
  ownerId: string;
  settings: StudySettings;
  visibility: Visibility;
  createdAt: number;
  from: string;
  likes: number;
  isNew?: boolean;
  liked: boolean;
  features: StudyFeatures;
  chapters: StudyChapterMeta[];
  chapter: StudyChapter;
  secondsSinceUpdate: number;
  description?: string;
  topics?: Topic[];
  admin: boolean;
  hideRatings?: boolean;
}

export type Topic = string;

type UserSelection = 'nobody' | 'owner' | 'contributor' | 'member' | 'everyone';

export interface StudySettings {
  computer: UserSelection;
  explorer: UserSelection;
  cloneable: UserSelection;
  shareable: UserSelection;
  chat: UserSelection;
  sticky: boolean;
  description: boolean;
}

export interface ReloadData {
  analysis: AnalyseData;
  study: StudyData;
}

export interface Position {
  chapterId: string;
  path: Tree.Path;
}

export interface StudyFeatures {
  cloneable: boolean;
  shareable: boolean;
  chat: boolean;
  sticky: boolean;
}

export interface StudyChapterMeta {
  id: string;
  name: string;
  ongoing?: boolean;
  res?: '1-0' | '0-1' | '½-½' | '*';
}

export interface StudyChapterConfig extends StudyChapterMeta {
  orientation: Color;
  description?: string;
  practice: boolean;
  gamebook: boolean;
  conceal?: number;
}

export interface StudyChapter {
  id: string;
  name: string;
  ownerId: string;
  setup: StudyChapterSetup;
  tags: TagArray[];
  practice: boolean;
  conceal?: number;
  gamebook: boolean;
  features: StudyChapterFeatures;
  description?: string;
  relay?: StudyChapterRelay;
}

export interface StudyChapterRelay {
  path: Tree.Path;
  secondsSinceLastMove?: number;
  lastMoveAt?: number;
}

interface StudyChapterSetup {
  gameId?: string;
  variant: {
    key: string;
    name: string;
  };
  orientation: Color;
  fromFen?: string;
}

interface StudyChapterFeatures {
  computer: boolean;
  explorer: boolean;
}

export type StudyMember = {
  user: {
    id: string;
    name: string;
    title?: string;
  };
  role: string;
};

export interface StudyMemberMap {
  [id: string]: StudyMember;
}

export type TagTypes = string[];
export type TagArray = [string, string];

export interface LocalPaths {
  [chapterId: string]: Tree.Path;
}

export interface ChapterPreview {
  id: string;
  name: string;
  players?: {
    white: ChapterPreviewPlayer;
    black: ChapterPreviewPlayer;
  };
  orientation: Color;
  fen: string;
  lastMove?: string;
  lastMoveAt?: number;
  playing: boolean;
  outcome?: '1-0' | '0-1' | '½-½';
}

export interface ChapterPreviewPlayer {
  name: string;
  title?: string;
  rating?: number;
  clock?: number;
}

export type Orientation = 'black' | 'white' | 'auto';
export type ChapterMode = 'normal' | 'practice' | 'gamebook' | 'conceal';

export interface ChapterData {
  name: string;
  game?: string;
  variant?: VariantKey;
  fen?: Fen | null;
  pgn?: string;
  orientation: Orientation;
  mode: ChapterMode;
  initial: boolean;
  isDefaultName: boolean;
}

export interface EditChapterData {
  id: string;
  name: string;
  orientation: Orientation;
  mode: ChapterMode;
  description: string;
}

export interface AnaDests {
  dests: string;
  path: string;
  ch?: string;
  opening?: Opening;
}

export interface AnaMove {
  orig: string;
  dest: string;
  fen: Fen;
  path: string;
  variant?: VariantKey;
  ch?: string;
  promotion?: cg.Role;
}

export interface AnaDrop {
  role: cg.Role;
  pos: Key;
  variant?: VariantKey;
  fen: Fen;
  path: string;
  ch?: string;
}
export interface WithWho {
  w: {
    s: string;
    u: string;
  };
}

export interface WithPosition {
  p: Position;
}

export interface WithChapterId {
  chapterId: string;
}

export type WithWhoAndPos = WithWho & WithPosition;
export type WithWhoAndChap = WithWho & WithChapterId;
