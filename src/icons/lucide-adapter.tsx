import React from 'react';

export type LucideProps = React.SVGProps<SVGSVGElement> & {
  color?: string;
  size?: number | string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
};

export type LucideIcon = React.FC<LucideProps>;

const modules = import.meta.glob('./nucleo/**/*.svg', {
  eager: true,
  import: 'ReactComponent',
}) as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>;

const byFile = new Map<string, React.FC<React.SVGProps<SVGSVGElement>>>();
for (const [p, C] of Object.entries(modules)) {
  const file = p.split('/').pop()!.replace('.svg', '');
  byFile.set(file, C);
}

function makeIcon(file: string): LucideIcon {
  const C = byFile.get(file);
  const Icon: LucideIcon = ({ size = 24, color = 'currentColor', className, style, ...rest }) => {
    if (!C) {
      return <span className={className} style={{ width: size, height: size, display: 'inline-block', flexShrink: 0, ...style }} aria-hidden />;
    }
    return (
      <C 
        width={size} 
        height={size} 
        className={className} 
        style={{ 
          display: 'inline-block', 
          flexShrink: 0, 
          verticalAlign: 'middle',
          fill: color,
          color: color,
          ...style 
        }} 
        {...rest} 
      />
    );
  };
  return Icon;
}

export const AlertCircle = makeIcon('circle-info');
export const AlertTriangle = makeIcon('triangle-warning');
export const ArrowLeft = makeIcon('circle-arrow-left');
export const ArrowUp = makeIcon('circle-arrow-up');
export const Bell = makeIcon('bell');
export const Book = makeIcon('book-open');
export const Bot = makeIcon('msgs');
export const Brain = makeIcon('image-depth');
export const Calendar = makeIcon('calendar');
export const Check = makeIcon('circle-check');
export const CheckCircle = makeIcon('circle-check');
export const ChevronDown = makeIcon('circle-arrow-down');
export const ChevronLeft = makeIcon('circle-arrow-left');
export const ChevronRight = makeIcon('circle-arrow-right');
export const ChevronUp = makeIcon('circle-arrow-up');
export const Clock = makeIcon('timeline-vertical');
export const DollarSign = makeIcon('money-bill');
export const Download = makeIcon('file-download');
export const Ear = makeIcon('headphones');
export const Edit = makeIcon('pen');
export const Eye = makeIcon('eye');
export const FileText = makeIcon('file');
export const Grid = makeIcon('grid');
export const HelpCircle = makeIcon('circle-question');
export const Heart = makeIcon('heart');
export const Home = makeIcon('house');
export const Info = makeIcon('circle-info');
export const List = makeIcon('bullet-list');
export const LogOut = makeIcon('circle-power-off');
export const Mail = makeIcon('msgs');
export const MapPin = makeIcon('pin');
export const Menu = makeIcon('grid');
export const MessageSquare = makeIcon('msgs');
export const Minus = makeIcon('ban');
export const Palette = makeIcon('color-palette');
export const Paperclip = makeIcon('link');
export const Phone = makeIcon('headphones');
export const Pill = makeIcon('circle-coin');
export const Plus = makeIcon('circle-copy-plus');
export const RefreshCw = makeIcon('loader');
export const Search = makeIcon('magnifier');
export const Send = makeIcon('paper-plane');
export const Settings = makeIcon('settings-wrench');
export const Shield = makeIcon('badge-sparkle');
export const Smile = makeIcon('face-grin');
export const SortAsc = makeIcon('move-up-left');
export const SortDesc = makeIcon('move-down-right');
export const Star = makeIcon('star');
export const Trash = makeIcon('delete-x');
export const Trash2 = makeIcon('delete-x');
export const TrendingDown = makeIcon('move-down-right');
export const TrendingUp = makeIcon('move-up-left');
export const Upload = makeIcon('cloud-upload');
export const User = makeIcon('user');
export const Users = makeIcon('users');
export const Video = makeIcon('video');
export const X = makeIcon('delete-x');
export const XCircle = makeIcon('delete-x');
export const History = makeIcon('timeline-vertical');
export const EyeOff = makeIcon('eye');
export const Volume2 = makeIcon('headphones');
export const Music = makeIcon('headphones');
export const Disc = makeIcon('circle-coin');
export const Moon = makeIcon('circle-dots');
export const Sun = makeIcon('brightness-increase');
export const Cloud = makeIcon('cloud-download');
export const Zap = makeIcon('bolt');
export const Flower = makeIcon('feather');
export const Coffee = makeIcon('circle-coin');
export const Circle = makeIcon('circle-dots');
export const Square = makeIcon('square-grid');
export const Triangle = makeIcon('triangle-warning');
export const Frown = makeIcon('face-grin');
export const Angry = makeIcon('face-grin');
export const Meh = makeIcon('face-grin');
export const Laugh = makeIcon('face-grin');
export const Flower2 = makeIcon('feather');
export const Sparkles = makeIcon('sparkle');

export type { LucideProps as IconProps, LucideIcon as IconType };
