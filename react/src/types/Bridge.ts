export type AppSchema = {
  nfcReadResponse: () => {
    error: string | undefined, tag: string | undefined
  },
}