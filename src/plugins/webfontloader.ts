/**
 * plugins/webfontloader.ts
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */
import styles from "../styles/_export.module.scss";
const fontName =
  (styles.fontFamily as string | undefined)?.split(",")[0]?.replace(/"/g, "") ??
  "Roboto";
export async function loadFonts() {
  const webFontLoader = await import(
    /* webpackChunkName: "webfontloader" */ "webfontloader"
  );

  webFontLoader.load({
    google: {
      families: [`${fontName}:100,300,400,500,700,900&display=swap`],
    },
  });
}
