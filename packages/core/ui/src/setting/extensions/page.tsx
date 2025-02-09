"use client";
import {
    Box,
    IconButton,
    Theme,
    Typography,
    useMediaQuery
} from "@mui/material";
import {
    Filesystem
} from "@tybys/browser-asar";
import No from "@verkfi/shared/No";
import {
    FilePondFile,
    FilePondServerConfigProps
} from "filepond";
import {
    useAtom,
    useAtomValue,
    useSetAtom
} from "jotai";
import extensionsAtom, {
    convertedExtensionsAtom
} from "@verkfi/shared/atoms/extensions";
import {
    startTransition,
    useState
} from "react";
import {
    FilePond
} from "react-filepond"; // Import React FilePond
import {
    get
} from "react-intl-universal";
import {
    emptyNXTMetadata
} from "tools/extension/empties";
import {
    noIconTool
} from "tools/info";
import DialogButtons from "./DialogButtons";
import DialogInputs from "./DialogInputs";
import RemoveExtensionDialog from "./RemoveExtensionDialog";
import {
    file
} from "@verkfi/shared/reader/db";
import ToolsStackWithTools from "index/showTool";
import MouseOverPopover from "@verkfi/shared/Popover";
import {
    Edit,
    RestartAlt
} from "@mui/icons-material";
import {
    flatten
} from "array-flatten";
import {
    extensionDataCleanerAtom
} from "@verkfi/shared/atoms";
import {
    fileInfoAtom,
    filesAtom,
    removeDialogOpenAtom
} from "./atoms";
import {
    Provider
} from "jotai";
import {
    setting
} from "./consts";
import PureDialog from "@verkfi/shared/dialog/Pure";
export type inputTypes = "modify" | "add";
export default function ExtensionManager() {
    const [addDialogOpen, setAddDialogOpen] = useState<false | inputTypes>(false),
        [fileArray, setFileArray] = useState<FilePondFile[]>([]),
        [fileInfo, setFileInfo] = useAtom(fileInfoAtom),
        [files, setFiles] = useAtom(filesAtom),
        [removeDialogOpen, setRemoveDialogOpen] = useAtom(removeDialogOpenAtom),
        clearExtensionData = useSetAtom(extensionDataCleanerAtom),
        fullScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm")),
        extensionTools = useAtomValue(extensionsAtom),
        converted = useAtomValue(convertedExtensionsAtom);
    function reset() {
        setAddDialogOpen(false);
        setRemoveDialogOpen(false);
        setFileArray([]);
        setFiles([]);
        setFileInfo(emptyNXTMetadata);
    }
    return <>
        <Typography variant="h4">
            {get("extensions.扩展")}
        </Typography>
        <Box sx={{
            mb: 2
        }}>
            <Provider>
                <ToolsStackWithTools paramTool={converted} notfound={<No>
                    {get("extensions.未找到任何扩展")}
                </No>} actions={extensionTools?.map(single => <>
                    <MouseOverPopover text={get("extensions.clear")}>
                        <IconButton onClick={event => {
                            const {
                                ...metadata
                            } = single;
                            startTransition(async () => await clearExtensionData(metadata));
                        }} aria-label={get("extensions.clear")}>
                            <RestartAlt />
                        </IconButton>
                    </MouseOverPopover>
                    <MouseOverPopover text={get("extensions.删除扩展")}>
                        <IconButton onClick={event => {
                            setFileInfo({
                                ...single
                            });
                            setAddDialogOpen("modify");
                        }} aria-label={get("extensions.删除扩展")}>
                            <Edit />
                        </IconButton>
                    </MouseOverPopover>
                </>)} disableClick />
            </Provider>
        </Box>
        <FilePond
            files={fileArray as unknown as FilePondServerConfigProps["files"]}
            onupdatefiles={files => {
                setFileArray(files);
                const reader = new FileReader();
                reader.addEventListener("load", event => {
                    const fs = new Filesystem(new Uint8Array(reader.result as ArrayBuffer)),
                        dir = fs.readdirSync("/"),
                        main = JSON.parse(fs.readFileSync("package.json", true));
                    setFileInfo({
                        name: main.name,
                        to: main.to,
                        desc: main.description,
                        icon: main.icon,
                        color: main.color,
                        main: main.main,
                        settings: "settings" in main ? (main.settings satisfies setting[]).map((settingItem: setting) => ({
                            ...settingItem,
                            value: settingItem.defaultValue
                        })) : []
                    });
                    const readInternal: (path: string) => file | file[] = path => fs.statSync(path).isDirectory() ? flatten(
                        fs.readdirSync(path).map(pathchild => readInternal(`${path}/${pathchild}`))
                    ) : {
                        path,
                        file: fs.readFileSync(path)
                    };
                    setFiles(dir.map(readInternal).flat(1));
                    if (extensionTools.some(item => item.to === main.to)) {
                        setAddDialogOpen("modify");
                        return setAddDialogOpen(false);
                    }
                });
                files.forEach(file => reader.readAsArrayBuffer(file.file));
                if (files.length > 0) {
                    setAddDialogOpen("add");
                }
            }}
            allowMultiple
            maxFiles={1}
            name="files"
            acceptedFileTypes={[".vxt"]}
            labelIdle={get("drag.extensionAdd")}
        />
        <RemoveExtensionDialog open={removeDialogOpen} reset={reset} fileInfo={fileInfo} files={files} />
        <PureDialog action={(
            <DialogButtons
                type={addDialogOpen || "add"}
                fileInfo={fileInfo}
                files={files}
                reset={reset}
            />
        )} add={{
            fullScreen: fullScreen
        }} open={!!addDialogOpen} onClose={() => reset()} title={get(`extensions.${addDialogOpen === "add" ? "添加" : "编辑"}扩展`)}>
            <DialogInputs
                type={addDialogOpen || "add"}
                reset={reset}
            />
        </PureDialog>
    </>;
}
export interface NXTMetadata extends noIconTool {
    icon: string;
    main: string;
    settings: setting[];
}
