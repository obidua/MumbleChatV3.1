import { type FC } from "react";
import classes from "../LandingPages.module.css";

export const FloatingShapes: FC = () => {
  return (
    <div className={classes.floatingShapes} aria-hidden="true">
      <div className={classes.floatingShape} />
      <div className={classes.floatingShape} />
      <div className={classes.floatingShape} />
    </div>
  );
};
