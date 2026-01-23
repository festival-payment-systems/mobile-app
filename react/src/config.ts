interface Config {
  /** The base url of the backend. **/
  BASE_URL: string,
  /** If True, all fetches are loading at least for 1 second. **/
  useArtificialLoading: boolean,
  projectName: string,
  /** How often event invitations are refetched in milliseconds. (e.g. in EventsOverview.tsx) **/
  eventInvitationsRefetchInterval: number,
}

export const config: Config = {
  BASE_URL: 'https://fps-dev.duckdns.org',
  useArtificialLoading: true,
  projectName: 'Festival Payment System',
  eventInvitationsRefetchInterval: 2000,
}