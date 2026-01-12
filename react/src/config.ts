interface Config {
  /** The base url of the backend. **/
  BASE_URL: string,
  /** If True, all fetches are loading at least for 1 second. **/
  useArtificialLoading: boolean,
}

export const config: Config = {
  BASE_URL: 'https://fps-dev.duckdns.org',
  useArtificialLoading: true,

}