"use client";
import {
    Checkbox,
    FormControlLabel
} from "@mui/material";
import CheckDialog from "@verkfi/shared/dialog/Check";
import {
    useAtom,
    useSetAtom
} from "jotai";
import extensionsAtom from "@verkfi/shared/atoms/extensions";
import {
    extensionDataCleanerAtom,
    listsAtom
} from "@verkfi/shared/atoms";
import {
    startTransition,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    NXTMetadata
} from "./page";
import {
    file
} from "@verkfi/shared/reader/db";
export default function RemoveExtensionDialog(props: {
    open: boolean;
    reset: () => any;
    fileInfo: NXTMetadata;
    onTrue?: () => any;
    files: file[];
}) {
    const [clearData, setClearData] = useState(false),
        clearExtensionData = useSetAtom(extensionDataCleanerAtom),
        setExtensions = useSetAtom(extensionsAtom),
        [lists, setLists] = useAtom(listsAtom);
    return (
        <CheckDialog insert={<FormControlLabel control={(
            <Checkbox value={clearData} onChange={event => {
                setClearData(event.target.checked);
            }} />
        )} label={get("extensions.clear")} />} onFalse={() => {
            props.reset();
            setClearData(false);
        }} onTrue={async () => {
            startTransition(async () => {
                const draft = structuredClone(lists);
                draft.keys().forEach(list => {
                    draft.set(list, draft.get(list).filter(item => item !== `/tools/extension?tool=${props.fileInfo.to}`));
                });
                await setLists(draft);
                if (clearData) {
                    return await clearExtensionData(props.fileInfo);
                }
            });
            setExtensions({
                ...props.fileInfo,
                action: "delete"
            });
            setClearData(false);
            if ("onTrue" in props) {
                props.onTrue();
            }
            return props.reset();
        }} open={props.open} title={get("extensions.删除扩展")} description={`${get("extensions.确定删除扩展")}${props.fileInfo.name}?`} />
    );
}
