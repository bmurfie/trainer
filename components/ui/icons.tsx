import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
  className?: string;
};

const createIcon = (path: React.ReactNode) =>
  ({ className, ...props }: IconProps) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {path}
    </svg>
  );

export const LayoutDashboardIcon = createIcon(
  <React.Fragment>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="11" width="7" height="10" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </React.Fragment>
);

export const DumbbellIcon = createIcon(
  <React.Fragment>
    <path d="M5 5l2 2m12-2l-2 2M5 19l2-2m12 2l-2-2M7 7l10 10" />
    <path d="M17 7h2a1 1 0 0 1 1 1v2M7 17H5a1 1 0 0 1-1-1v-2" />
    <path d="M7 7V5a1 1 0 0 1 1-1h2M17 17v2a1 1 0 0 1-1 1h-2" />
  </React.Fragment>
);

export const FlameIcon = createIcon(
  <React.Fragment>
    <path d="M12 3c1.5 2.5 4 4 4 7a4 4 0 0 1-8 0c0-3 2.5-4.5 4-7z" />
    <path d="M12 21c-3 0-6-2.5-6-6 0-1.5.5-3 1.5-4.5" />
    <path d="M12 21c3 0 6-2.5 6-6 0-1.5-.5-3-1.5-4.5" />
  </React.Fragment>
);

export const ChartLineUpIcon = createIcon(
  <React.Fragment>
    <path d="M3 3v18h18" />
    <path d="M19 7l-5 5-4-4-5 5" />
    <path d="M15 7h4v4" />
  </React.Fragment>
);

export const BookOpenIcon = createIcon(
  <React.Fragment>
    <path d="M3 4a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
    <path d="M21 4a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v16a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2z" />
  </React.Fragment>
);

export const SparkleIcon = createIcon(
  <React.Fragment>
    <path d="M12 3v3" />
    <path d="M12 18v3" />
    <path d="M3 12h3" />
    <path d="M18 12h3" />
    <path d="M16 8l2-2" />
    <path d="M6 18l2-2" />
    <path d="M8 8 6 6" />
    <path d="m18 18-2-2" />
  </React.Fragment>
);

export const HistoryIcon = createIcon(
  <React.Fragment>
    <path d="M3 12a9 9 0 1 1 9 9" />
    <path d="M12 7v5l3 3" />
    <path d="M3 12h3" />
  </React.Fragment>
);

export const WandIcon = createIcon(
  <React.Fragment>
    <path d="M15 4 6 13" />
    <path d="M8 6 5 9" />
    <path d="m18 15-3 3" />
    <path d="M12 3h.01" />
    <path d="M12 21h.01" />
    <path d="M3 12h.01" />
    <path d="M21 12h.01" />
    <path d="M19 5h.01" />
    <path d="M5 19h.01" />
  </React.Fragment>
);

export const TargetIcon = createIcon(
  <React.Fragment>
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2" />
    <path d="M21 12h-2" />
    <path d="M12 21v-2" />
    <path d="M3 12h2" />
  </React.Fragment>
);

export const BoltIcon = createIcon(
  <React.Fragment>
    <path d="M13 3 4 14h6v7l9-11h-6z" />
  </React.Fragment>
);

export const AppleIcon = createIcon(
  <React.Fragment>
    <path d="M16 2a4 4 0 0 0-2 3.5" />
    <path d="M8 2a4 4 0 0 1 2 3.5" />
    <path d="M12 22c-4 0-7-4-7-9a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6c0 5-3 9-7 9z" />
  </React.Fragment>
);

export const TrophyIcon = createIcon(
  <React.Fragment>
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
    <path d="M5 9a2 2 0 0 1-2-2V5h4" />
    <path d="M19 9a2 2 0 0 0 2-2V5h-4" />
  </React.Fragment>
);

export default {
  LayoutDashboardIcon,
  DumbbellIcon,
  FlameIcon,
  ChartLineUpIcon,
  BookOpenIcon,
  SparkleIcon,
  HistoryIcon,
  WandIcon,
  TargetIcon,
  BoltIcon,
  AppleIcon,
  TrophyIcon,
};
