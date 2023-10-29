"use client";
import {
    Button,
    Paper,
    Stack,
    Typography,
    Divider,
    TextField,
    IconButton,
    ButtonGroup,
    Box
} from "@mui/material";
import {
    useState
} from "react";
import I18N from "react-intl-universal";
import {
    FilePond
} from 'react-filepond'; // Import React FilePond
import dynamic from "next/dynamic";
const PureDialog = dynamic(() => import("../../components/dialog/PureDialog"));
import {
    FilePondFile,
    FilePondServerConfigProps
} from 'filepond';
/**
 * In PluginDevelpmenting.md
 */
interface NXTMetadata {
    name: string;
    to: Lowercase<string>;
    desc: string;
    icon: string;
    color: [string, string];
}
const emptyNXTMetadata: NXTMetadata = {
    name: "",
    desc: "",
    to: "",
    icon: "",
    color: ["", ""]
}
import {
    Add as AddIcon,
    Edit as EditIcon
} from "@mui/icons-material";
import {
    useLiveQuery
} from "dexie-react-hooks";
import Image from "next/image";
import db from "../../extendedTools/db";
import CheckDialog from "../../components/dialog/CheckDialog";
export default function ExtendedManager() {
    var [addDialogOpen, setAddDialogOpen] = useState<boolean>(false),
        [fileArray, setFileArray] = useState<FilePondFile[]>([]),
        [fileInfo, setFileInfo] = useState<NXTMetadata>(emptyNXTMetadata),
        [file, setFile] = useState<string>("__UnReaded__"),
        [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false),
        [modifyDialogOpen, setModifyDialogOpen] = useState<boolean>(false);
    const reset = () => {
        setAddDialogOpen(false);
        setModifyDialogOpen(false);
        setRemoveDialogOpen(false);
        setFileArray([]);
        setFile("__UnReaded__");
        setFileInfo(emptyNXTMetadata);
    },
        extendedTools = useLiveQuery(() => db.extendedTools.toArray());
    function DialogInputs(props: {
        type: "modify" | "add"
    }) {
        return (
            <>
                {[["name", "名称"], ["to", "ID"], ["desc", "描述"], ["icon", "图标"], ["color", "背景色"]].map(item => <TextField key={item[0]} margin="dense" value={fileInfo[item[0]]} label={I18N.get(item[1])} fullWidth variant="standard" onChange={event => {
                    var bufferInfo: NXTMetadata = JSON.parse(JSON.stringify(fileInfo));
                    bufferInfo[item[0]] = event.target.value;
                    setFileInfo(bufferInfo);
                }} />)}
                <ButtonGroup fullWidth>
                    {file !== "__UnReaded__" && <Button variant="contained" onClick={async event => {
                        const id = await db.extendedTools.put({
                            ...fileInfo,
                            file,
                            color: fileInfo.color
                        });
                        reset();
                    }}>
                        {props.type === "add" ? I18N.get("添加") : I18N.get("编辑")}
                    </Button>}
                    {props.type === "modify" && <Button variant="outlined" onClick={async event => {
                        setModifyDialogOpen(false);
                        setRemoveDialogOpen(true);
                    }}>
                        {I18N.get("删除")}
                    </Button>}
                </ButtonGroup>
            </>
        );
    }
    return (
        <>
            <Typography variant="h4">
                {I18N.get('扩展')}
            </Typography>
            <Stack spacing={2}>
                {extendedTools?.map(single => <Paper sx={{
                    padding: 2
                }} key={single.to}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                            <Stack direction="row" spacing={1}>
                                <Box>
                                    <Image src={single.icon} alt={single.name} height={24} width={24} />
                                </Box>
                                <Box>
                                    <Typography>
                                        {single.name}
                                    </Typography>
                                    <Typography>
                                        <strong>{I18N.get("ID")}</strong> {single.to}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Box>
                                <strong>{I18N.get('描述')}</strong>
                                <br />
                                {single.desc}
                            </Box>
                        </Stack>
                        <IconButton onClick={event => {
                            setFile(single.file);
                            setFileInfo({
                                ...single
                            });
                            setModifyDialogOpen(true);
                        }}>
                            <EditIcon />
                        </IconButton>
                    </Box>
                </Paper>)}
            </Stack>
            <br />
            <Button startIcon={<AddIcon />} fullWidth onClick={event => {
                setAddDialogOpen(true);
            }} variant="outlined">
                {I18N.get("添加扩展")}
            </Button>
            <PureDialog open={modifyDialogOpen} onClose={event => {
                setModifyDialogOpen(false);
            }} title={I18N.get("编辑扩展")}>
                <DialogInputs type="modify" />
            </PureDialog>
            <CheckDialog open={removeDialogOpen} title={I18N.get("删除扩展")} description={`${I18N.get("确定删除扩展")}${fileInfo.name}?`} onFalse={() => {
                reset();
            }} onTrue={async () => {
                const id = await db.extendedTools.delete(fileInfo.to);
                reset();
            }} />
            <PureDialog open={addDialogOpen} onClose={() => {
                reset();
            }} title={I18N.get("添加扩展")}>
                <FilePond
                    files={fileArray as unknown as FilePondServerConfigProps["files"]}
                    onupdatefiles={files => {
                        setFileArray(files);
                        var reader = new FileReader();
                        reader.onload = function () {
                            const parsedFile = new DOMParser().parseFromString(reader.result as string, "text/html"),
                                getMetaInfo = (name: string) => {
                                    var content = parsedFile.getElementsByTagName("meta")[`nt:${name}`].content;
                                    parsedFile.getElementsByTagName("meta")[`nt:${name}`].remove();
                                    return content;
                                };
                            var metaData: NXTMetadata = emptyNXTMetadata;
                            ["name", "to", "desc", "icon", "color"].forEach((item: string) => metaData[item] = getMetaInfo(item));
                            metaData.color = JSON.parse(metaData.color as unknown as string);
                            setFileInfo(emptyNXTMetadata);
                            setFile(new XMLSerializer().serializeToString(parsedFile));
                        };
                        reader.readAsText(files[0].file);
                    }}
                    allowMultiple={true}
                    maxFiles={1}
                    name="files"
                    labelIdle={I18N.get('拖拽扩展到这里')}
                />
                <DialogInputs type="add" />
            </PureDialog>
        </>
    );
}