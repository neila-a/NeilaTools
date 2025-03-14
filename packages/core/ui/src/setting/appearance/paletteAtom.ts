import {
    atom
} from "jotai";
import defaultInternalPalette from "./defaultInternalPalette";
import * as colors from "@mui/material/colors";
import atomWithStorage from "@verkfi/shared/reader/atomWithStorage";
import defaultPalette from "./defaultPalette";
import {
    createTheme
} from "@mui/material";
import awaiter from "@verkfi/shared/reader/awaiter";
const internalPaletteAtom = atomWithStorage("internalPalette", defaultInternalPalette);
export const
    paletteAtom = atom(get => awaiter(
        get(internalPaletteAtom), internal => ({
            primary: {
                ...colors[internal.primaryHue],
                main: internal.primary
            },
            secondary: {
                ...colors[internal.secondaryHue],
                main: internal.secondary
            }
        } as typeof defaultPalette)
    )),
    themeAtom = atom(get => awaiter(
        get(paletteAtom), palette => {
            if (typeof createTheme === "function") {
                return createTheme({
                    cssVariables: {
                        cssVarPrefix: "verkfi"
                    },
                    colorSchemes: {
                        light: {
                            palette
                        },
                        dark: {
                            palette
                        }
                    },
                    typography: {
                        fontFamily: "Ubuntu"
                    }
                });
            }
        }
    ));
export default internalPaletteAtom;
