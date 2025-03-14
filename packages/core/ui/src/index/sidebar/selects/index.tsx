"use client";
import {
    DragDropContext,
    Draggable,
    Droppable
} from "@hello-pangea/dnd";
import {
    DragIndicator as DragIndicatorIcon,
    Edit as EditIcon
} from "@mui/icons-material";
import {
    Box,
    IconButton
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import {
    useAtom,
    useAtomValue,
    useSetAtom
} from "jotai";
import {
    listsAtom
} from "@verkfi/shared/atoms";
import {
    Fragment,
    ReactNode,
    createElement,
    startTransition,
    useContext
} from "react";
import {
    get
} from "react-intl-universal";
import reorderArray from "reorder-array";
import SingleSelect from "./SingleSelect";
import toolsListAtom from "@verkfi/shared/atoms/toolsList";
import {
    editModeAtom,
    editingAtom,
    globalList,
    listName,
    searchTextAtom,
    sortedToolsAtom,
    sortingForAtom,
    toolsAtom
} from "index/atoms";
import {
    isImplantContext
} from "index/consts";
import {
    categoryDialogListNameAtom,
    categoryDialogOpenAtom,
    removeDialogOpenAtom
} from "@verkfi/shared/atoms/category";
import EditCategoryDialog from "./EditCategoryDialog";
import CheckDialog from "@verkfi/shared/dialog/Check";
export default function Selects(props: {
    isSidebar?: boolean;
    modifyClickCount(value: number | "++"): void;
}) {
    const isImplant = useContext(isImplantContext),
        sortingFor = useAtomValue(sortingForAtom)(isImplant),
        setSortingFor = useSetAtom(sortingForAtom),
        setEditing = useSetAtom(editingAtom),
        setSortedTools = useSetAtom(sortedToolsAtom),
        [searchText, setSearchText] = useAtom(searchTextAtom),
        [list, setList] = useAtom(listsAtom),
        setDialogOpen = useSetAtom(categoryDialogOpenAtom),
        gotToolsList = useAtomValue(toolsListAtom),
        [removeDialogOpen, setRemoveDialogOpen] = useAtom(removeDialogOpenAtom),
        [dialogListName, setDialogListName] = useAtom(categoryDialogListNameAtom),
        editMode = useAtomValue(editModeAtom),
        setTools = useSetAtom(toolsAtom);
    function RealSelect(aprops: {
        /**
         * 分类名称
         */
        single: string;
        isAll: boolean;
    }) {
        return <Box>
            <SingleSelect
                dragButton={editMode && !aprops.isAll && <DragIndicatorIcon />}
                isSidebar={Boolean(props.isSidebar)}
                key={JSON.stringify(aprops.single)}
                tool={aprops.single}
                onClick={event => {
                    const publicSet = draft => {
                        setEditing(searchText === "");
                        setSearchText("", isImplant);
                        props.modifyClickCount("++");
                        setSortedTools(draft);
                        startTransition(async () => await setTools(draft));
                    };
                    if (aprops.isAll) {
                        if (sortingFor !== globalList) {
                            const draft = gotToolsList;
                            props.modifyClickCount(0);
                            setSortingFor(globalList);
                            publicSet(draft);
                        }
                    } else {
                        if (sortingFor !== aprops.single) {
                            const draft = (
                                aprops.isAll ? [] as string[] : list.get(aprops.single as listName)
                            ).map(toolTo => gotToolsList.find(one => one.to === toolTo));
                            if (sortingFor !== aprops.single) {
                                props.modifyClickCount(0);
                            }
                            setSortingFor(aprops.single);
                            publicSet(draft);
                        }
                    }
                }} editButton={(
                    editMode && !aprops.isAll ? <MouseOverPopover text={get("index.editCategory")}>
                        <IconButton onClick={event => {
                            setDialogOpen(true);
                            setDialogListName(aprops.single);
                        }} aria-label={get("index.editCategory")}>
                            <EditIcon />
                        </IconButton>
                    </MouseOverPopover> : <Fragment />
                )} wantSortingFor={aprops.isAll ? globalList : aprops.single} />
        </Box>;
    }
    return (
        <Box sx={{
            width: "100%",
            display: props.isSidebar ? "" : "flex",
            justifyContent: "space-evenly",
            alignItems: "center"
        }}>
            <RealSelect single={get("全部")} isAll />
            <DragDropContext onDragEnd={result => {
                if (!result.destination) {
                    return;
                }
                if (result.destination.index === result.source.index) {
                    return;
                }
                if (editMode) {
                    const listArray = list.entries().toArray(),
                        newLists = reorderArray(listArray, result.source.index, result.destination.index) as typeof listArray;
                    return startTransition(() => setList(new Map(newLists)));
                }
            }}>
                <Droppable direction={props.isSidebar ? "vertical" : "horizontal"} droppableId="categories" isDropDisabled={!editMode}>
                    {provided => <Box ref={provided.innerRef} {...provided.droppableProps} sx={{
                        display: props.isSidebar ? "" : "flex"
                    }}>
                        {list.keys().filter(value => value !== globalList).map(a => JSON.stringify(a)).map((value, index) => createElement(
                            editMode ? (props: {
                                children: ReactNode;
                            }) => <Draggable draggableId={value} index={index} key={value}>
                                    {provided => <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        {props.children}
                                    </Box>}
                                </Draggable> : Fragment,
                            {
                                key: value
                            },
                            <RealSelect single={value} isAll={false} />
                        ))}
                        {provided.placeholder}
                    </Box>
                    }
                </Droppable>
            </DragDropContext>
            {editMode && <>
                <EditCategoryDialog left={gotToolsList.filter(tool => {
                    return list.get(dialogListName)?.includes(tool.to);
                }).map(tool => tool.name)} />
                <CheckDialog open={removeDialogOpen} title={get("category.删除此分类")} onTrue={() => {
                    const listDraft = structuredClone(list);
                    listDraft.delete(dialogListName);
                    setList(listDraft);
                    setDialogListName("");
                    return setRemoveDialogOpen(false);
                }} onFalse={() => {
                    setDialogListName("");
                    return setRemoveDialogOpen(false);
                }} description={get("category.确定删除此分类吗？")} />
            </>}
        </Box>
    );
}
