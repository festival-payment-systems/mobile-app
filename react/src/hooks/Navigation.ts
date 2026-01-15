import type {NavigateFunction, NavigateOptions, To} from "react-router";

/**
 * From useNavigate() to nav the react-router
 */
let navigateFn: NavigateFunction

export function setNavigateFn(fn: NavigateFunction) {
  navigateFn = fn
}

export function navigateTo(to: To, options?: NavigateOptions) {
  if (navigateFn) navigateFn(to, options)
}


/**
 * From Layout.tsx to set a custom Route Title
 */
let routeTitleFn: ((title: string) => void) | null = null

export function setRouteTitleFn(fn: (title: string) => void) {
  routeTitleFn = fn
}

export function setRouteTitle(title: string) {
  if (routeTitleFn) routeTitleFn(title)
}


/**
 * From Layout.tsx to hide or show the Appbar
 */
let appBarVisibleFn: ((visible: boolean) => void) | null = null

export function setAppBarVisibleFn(fn: (visible: boolean) => void) {
  appBarVisibleFn = fn
}

export function setAppBarVisible(visible: boolean) {
  if (appBarVisibleFn) appBarVisibleFn(visible)
}