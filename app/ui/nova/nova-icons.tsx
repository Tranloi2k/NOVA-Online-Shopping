type IconName =
  | "cart" | "search" | "user" | "heart" | "arrow" | "chevron"
  | "chevronDown" | "plus" | "minus" | "check" | "star" | "truck"
  | "shield" | "refresh" | "bolt" | "close" | "menu" | "lock"
  | "headset" | "eye" | "eyeOff" | "pin" | "bell" | "card"
  | "box" | "logout" | "edit" | "trash" | "mail" | "gift"
  | "google" | "apple";

const paths: Record<IconName, React.ReactNode> = {
  cart: <><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2.2l2 12.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.3L21 7H6"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/></>,
  user: <><circle cx="12" cy="8" r="3.6"/><path d="M5 20c.6-3.8 3.4-6 7-6s6.4 2.2 7 6"/></>,
  heart: <path d="M12 20s-7.5-4.7-7.5-10A4 4 0 0 1 12 7.6 4 4 0 0 1 19.5 10c0 5.3-7.5 10-7.5 10Z"/>,
  arrow: <><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></>,
  chevron: <path d="M9 6l6 6-6 6"/>,
  chevronDown: <path d="M6 9l6 6 6-6"/>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  minus: <path d="M5 12h14"/>,
  check: <path d="M5 12.5l4.5 4.5L19 7"/>,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L4.5 9.7l5.9-.9L12 3.5Z"/>,
  truck: <><rect x="1.5" y="6" width="12" height="10" rx="1.5"/><path d="M13.5 9h4l3 3v4h-7"/><circle cx="6" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></>,
  shield: <path d="M12 3l7 2.5v5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5v-5L12 3Z"/>,
  refresh: <><path d="M4 11a8 8 0 0 1 14-5l2 2"/><path d="M20 13a8 8 0 0 1-14 5l-2-2"/><path d="M20 4v4h-4M4 20v-4h4"/></>,
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>,
  close: <><path d="M6 6l12 12"/><path d="M18 6 6 18"/></>,
  menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
  headset: <><path d="M5 13v-1a7 7 0 0 1 14 0v1"/><rect x="3.5" y="13" width="3.5" height="6" rx="1.5"/><rect x="17" y="13" width="3.5" height="6" rx="1.5"/><path d="M19 19a4 4 0 0 1-4 3h-2"/></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></>,
  eyeOff: <><path d="M3 3l18 18"/><path d="M10.6 6.2A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-3.3 3.9M6.3 7.7A16 16 0 0 0 2.5 12S6 18 12 18a9.6 9.6 0 0 0 3.4-.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></>,
  pin: <><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/></>,
  card: <><rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 9.5h19"/><path d="M6 14.5h4"/></>,
  box: <><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/></>,
  logout: <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 12h10M16 8l4 4-4 4"/></>,
  edit: <><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="M13.5 6.5l3 3"/></>,
  trash: <><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></>,
  mail: <><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></>,
  gift: <><rect x="3.5" y="9" width="17" height="5" rx="1"/><path d="M5 14v6.5h14V14M12 9v11.5"/><path d="M12 9S10.8 4.5 8.3 5.1C6.6 5.5 6.7 8 8.3 8.6c1.4.5 3.7.4 3.7.4ZM12 9s1.2-4.5 3.7-3.9c1.7.4 1.6 2.9 0 3.5-1.4.5-3.7.4-3.7.4Z"/></>,
  google: <g strokeWidth="0"><path fill="#4285F4" d="M21.6 12.2c0-.7-.06-1.4-.18-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.4 3-4.1 5.6-4.1Z"/></g>,
  apple: <path fill="currentColor" stroke="none" d="M16 12.6c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.1 0 1.9-1.1 2.6-2.1.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.2-.9-2.2-3.5ZM13.9 6.3c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2Z"/>,
};

export function Icon({
  name,
  size = 20,
  sw = 1.8,
}: {
  name: IconName;
  size?: number;
  sw?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
