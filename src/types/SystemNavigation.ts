export interface SystemNavigationType {
  system: string;
  systemSlug: string;
  systemId: string;
  navigation: SystemNavigationItemType[];
}

export interface SystemNavigationItemType {
  name: string;
  slug: string;
  systemId: string;
  children: SystemNavigationChildType[];
}

export interface SystemNavigationChildType {
  name: string;
  slug: string;
}
