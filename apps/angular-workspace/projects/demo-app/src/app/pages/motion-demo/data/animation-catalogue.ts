/* ─── Shared animation catalogue data ─── */

export interface AnimGroup {
  label: string;
  tag: string;
  color: string;
  items: string[];
}

export interface AnimCategory {
  id: string;
  label: string;
  icon: string;
  groups: AnimGroup[];
}

export const ANIM_CATEGORIES: AnimCategory[] = [
  {
    id: 'attention-seekers',
    label: 'Attention Seekers',
    icon: 'zap',
    groups: [
      {
        label: 'Attention Seekers',
        tag: 'Attention',
        color: 'from-amber-500 to-orange-600',
        items: [
          'pulse',
          'rubber-band',
          'shake-x',
          'shake-y',
          'head-shake',
          'swing',
          'tada',
          'wobble',
          'jello',
          'heart-beat',
          'flash',
          'bounce',
        ],
      },
      {
        label: 'Interaction Helpers',
        tag: 'Interaction',
        color: 'from-lime-500 to-green-600',
        items: ['scale-up', 'scale-down'],
      },
    ],
  },
  {
    id: 'fading',
    label: 'Fading',
    icon: 'eye',
    groups: [
      {
        label: 'Fading Entrances',
        tag: 'Fade In',
        color: 'from-sky-500 to-blue-600',
        items: [
          'fade-in',
          'fade-in-down',
          'fade-in-down-big',
          'fade-in-left',
          'fade-in-left-big',
          'fade-in-right',
          'fade-in-right-big',
          'fade-in-up',
          'fade-in-up-big',
          'fade-in-top-left',
          'fade-in-top-right',
          'fade-in-bottom-left',
          'fade-in-bottom-right',
        ],
      },
      {
        label: 'Fading Exits',
        tag: 'Fade Out',
        color: 'from-slate-500 to-slate-700',
        items: [
          'fade-out',
          'fade-out-down',
          'fade-out-down-big',
          'fade-out-left',
          'fade-out-left-big',
          'fade-out-right',
          'fade-out-right-big',
          'fade-out-up',
          'fade-out-up-big',
        ],
      },
    ],
  },
  {
    id: 'sliding',
    label: 'Sliding',
    icon: 'arrow-right',
    groups: [
      {
        label: 'Sliding Entrances',
        tag: 'Slide In',
        color: 'from-emerald-500 to-green-600',
        items: ['slide-in-up', 'slide-in-down', 'slide-in-left', 'slide-in-right'],
      },
      {
        label: 'Sliding Exits',
        tag: 'Slide Out',
        color: 'from-emerald-700 to-green-900',
        items: ['slide-out-up', 'slide-out-down', 'slide-out-left', 'slide-out-right'],
      },
    ],
  },
  {
    id: 'zooming',
    label: 'Zooming',
    icon: 'search',
    groups: [
      {
        label: 'Zooming Entrances',
        tag: 'Zoom In',
        color: 'from-violet-500 to-purple-600',
        items: ['zoom-in', 'zoom-in-down', 'zoom-in-left', 'zoom-in-right', 'zoom-in-up'],
      },
      {
        label: 'Zooming Exits',
        tag: 'Zoom Out',
        color: 'from-violet-700 to-purple-900',
        items: ['zoom-out', 'zoom-out-down', 'zoom-out-left', 'zoom-out-right', 'zoom-out-up'],
      },
    ],
  },
  {
    id: 'bouncing',
    label: 'Bouncing',
    icon: 'circle',
    groups: [
      {
        label: 'Bouncing Entrances',
        tag: 'Bounce In',
        color: 'from-rose-500 to-pink-600',
        items: ['bounce-in', 'bounce-in-down', 'bounce-in-left', 'bounce-in-right', 'bounce-in-up'],
      },
      {
        label: 'Bouncing Exits',
        tag: 'Bounce Out',
        color: 'from-rose-700 to-pink-900',
        items: ['bounce-out', 'bounce-out-down', 'bounce-out-left', 'bounce-out-right', 'bounce-out-up'],
      },
    ],
  },
  {
    id: 'flippers',
    label: 'Flippers',
    icon: 'rotate-cw',
    groups: [
      {
        label: 'Flippers',
        tag: 'Flip',
        color: 'from-cyan-500 to-teal-600',
        items: ['flip', 'flip-in-x', 'flip-in-y', 'flip-out-x', 'flip-out-y'],
      },
    ],
  },
  {
    id: 'rotating',
    label: 'Rotating',
    icon: 'refresh-cw',
    groups: [
      {
        label: 'Rotating Entrances',
        tag: 'Rotate In',
        color: 'from-indigo-500 to-indigo-700',
        items: ['rotate-in', 'rotate-in-down-left', 'rotate-in-down-right', 'rotate-in-up-left', 'rotate-in-up-right'],
      },
      {
        label: 'Rotating Exits',
        tag: 'Rotate Out',
        color: 'from-indigo-700 to-indigo-900',
        items: ['rotate-out', 'rotate-out-down-left', 'rotate-out-down-right', 'rotate-out-up-left', 'rotate-out-up-right'],
      },
    ],
  },
  {
    id: 'lightspeed',
    label: 'Light Speed',
    icon: 'zap',
    groups: [
      {
        label: 'Light Speed',
        tag: 'Speed',
        color: 'from-yellow-400 to-amber-500',
        items: ['light-speed-in-right', 'light-speed-in-left', 'light-speed-out-right', 'light-speed-out-left'],
      },
    ],
  },
  {
    id: 'back',
    label: 'Back',
    icon: 'skip-back',
    groups: [
      {
        label: 'Back Entrances',
        tag: 'Back In',
        color: 'from-fuchsia-500 to-fuchsia-700',
        items: ['back-in-down', 'back-in-left', 'back-in-right', 'back-in-up'],
      },
      {
        label: 'Back Exits',
        tag: 'Back Out',
        color: 'from-fuchsia-700 to-fuchsia-900',
        items: ['back-out-down', 'back-out-left', 'back-out-right', 'back-out-up'],
      },
    ],
  },
  {
    id: 'specials',
    label: 'Specials',
    icon: 'star',
    groups: [
      {
        label: 'Specials',
        tag: 'Special',
        color: 'from-red-500 to-red-700',
        items: ['hinge', 'jack-in-the-box', 'roll-in', 'roll-out'],
      },
    ],
  },
];

/** Flat list of ALL groups across every category */
export const ALL_ANIM_GROUPS: AnimGroup[] = ANIM_CATEGORIES.flatMap((c) => c.groups);
