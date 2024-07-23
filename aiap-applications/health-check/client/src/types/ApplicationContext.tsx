import { SESSION } from "./Session"

export type APPLICATION_CONTEXT = {
  session: SESSION,
  changeTheme: (theme: string) => void,
};
