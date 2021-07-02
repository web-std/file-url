export * from "./url.js"

export interface FileURL extends URL {
  protocol: "file:"
}
