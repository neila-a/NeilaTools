"use client";
import intl, {
    get
} from 'react-intl-universal';
import {
    Box,
    IconButton
} from "@mui/material";
import {
    Edit as EditIcon
} from "@mui/icons-material";
import {
    Hex,
    setState
} from '../declare';
import React, {
    useState
} from 'react';
import {
    getTools,
    tool
} from "../tools/info";
import getToolsList from './getToolsList';
import {
    locales
} from '../layout/layoutClient';
import setSetting from '../setting/setSetting';
import Image from 'next/image';
import {
    useLiveQuery
} from 'dexie-react-hooks';
import db from '../extendedTools/db';
import SingleSelect from './SingleSelect';
import dynamic from 'next/dynamic';
const EditToolsListDialog = dynamic(() => import("./EditToolsListDialog"));
const CheckDialog = dynamic(() => import("../components/dialog/CheckDialog"));
import {
    lists
} from './Sidebar';
import {
    DragDropContext,
    Draggable,
    Droppable
} from '@hello-pangea/dnd';
import reorder from '../components/reorder';
import {
    DragIndicator as DragIndicatorIcon
} from "@mui/icons-material";
export default function Selects(props: {
    list: lists;
    setList: setState<lists>;
    setEditing: setState<boolean>;
    sortingFor: string;
    setSortingFor: setState<string>;
    searchText: string;
    setSearchText: setState<string>;
    setSortedTools: setState<tool[]>;
    setTools: setState<tool[]>;
    editMode: boolean;
    setEditMode: setState<boolean>;
    isSidebar?: boolean;
    searchTools(search: string): void;
    modifyClickCount(value: number | "++"): void;
}) {
    const extendedTools = useLiveQuery(() => db.extendedTools.toArray()), convertedExtendedTools: tool[] = extendedTools?.map(single => ({
        name: single.name,
        to: `/extendedTools?id=${single.to}` as Lowercase<string>,
        desc: single.desc,
        icon: () => <Image src={single.icon} alt={single.name} height={24} width={24} />,
        color: single.color as [Hex.Hex, Hex.Hex],
        isGoto: true
    })), {
        list, setList, setTools, searchTools, searchText, setSearchText, sortingFor, setSortingFor, setEditing
    } = props,
        [dialogOpen, setDialogOpen] = useState<boolean>(false),
        [dialogTools, setDialogTools] = useState<string[]>([]),
        [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false),
        [dialogListName, setDialogListName] = useState<string>(""),
        realSelect = (single: [string, string[]], isAll: boolean) => (
            <Box>
                <SingleSelect
                    dragButton={props.editMode && !isAll && <DragIndicatorIcon />}
                    editMode={props.editMode}
                    isSidebar={Boolean(props.isSidebar)}
                    sortingFor={sortingFor}
                    searchText={searchText}
                    setEditing={setEditing}
                    key={single[0]}
                    tool={single[0]}
                    onClick={event => {
                        setEditing(true);
                        setSearchText("");
                        searchTools("");
                        let draft: tool[] = [];
                        props.modifyClickCount("++");
                        if (isAll) {
                            draft = getToolsList(getTools(get));
                            if (sortingFor !== "__global__") {
                                props.modifyClickCount(0);
                            }
                            setSortingFor("__global__");
                        } else {
                            draft = single[1].map(toolTo => getToolsList(getTools(get)).filter(one => one.to === toolTo)[0]);
                            if (sortingFor !== single[0]) {
                                props.modifyClickCount(0);
                            }
                            setSortingFor(single[0]);
                        }
                        props.setSortedTools(draft);
                        setTools(draft);
                    }} editButton={(
                        (props.editMode && !isAll) ? <IconButton onClick={event => {
                            setDialogOpen(true);
                            setDialogListName(single[0]);
                        }}>
                            <EditIcon />
                        </IconButton> : <></>
                    )} wantSortingFor={isAll ? "__global__" : single[0]} />
            </Box>
        );
    return (
        <Box sx={{
            width: "100%",
            display: Boolean(props.isSidebar) ? "" : "flex",
            justifyContent: "space-evenly",
            alignItems: "center"
        }}>
            {realSelect([get("全部"), getToolsList(getTools(get)).map(atool => atool.to)], true)}
            <DragDropContext onDragEnd={result => {
                if (!result.destination) {
                    return;
                }
                if (result.destination.index === result.source.index) {
                    return;
                }
                if (props.editMode) {
                    const newLists = reorder(props.list, result.source.index, result.destination.index);
                    setSetting("lists", "集合列表", JSON.stringify(newLists))
                    props.setList(newLists);
                }
            }}>
                <Droppable direction={Boolean(props.isSidebar) ? "vertical" : "horizontal"} droppableId="categories" isDropDisabled={!props.editMode}>
                    {provided => {
                        return (
                            <Box ref={provided.innerRef} {...provided.droppableProps} sx={{
                                display: Boolean(props.isSidebar) ? "" : "flex"
                            }}>
                                {list.map((value: [string, string[]], index: number) => {
                                    const single = value, isAll = Object.values(locales).some(singleLang => {
                                        const strings = Object.values(singleLang);
                                        let have: boolean = strings.includes(single[0]);
                                        return have;
                                    });
                                    return props.editMode ? (
                                        <Draggable draggableId={single[0]} index={index} key={single[0]}>
                                            {provided => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    {realSelect(value, false)}
                                                </div>
                                            )}
                                        </Draggable>
                                    ) : realSelect(value, false);
                                })}
                                {provided.placeholder}
                            </Box>
                        );
                    }}
                </Droppable>
            </DragDropContext>
            <SingleSelect dragButton={<></>} editMode={props.editMode} isSidebar={Boolean(props.isSidebar)} sortingFor={sortingFor} searchText={searchText} setEditing={setEditing} wantSortingFor="__extended__" tool={get("extensions.扩展工具")} onClick={event => {
                props.modifyClickCount("++");
                if (sortingFor !== "__extended__") {
                    props.modifyClickCount(0);
                }
                setSortingFor("__extended__");
                setEditing(false);
                props.setEditMode(false);
                props.setSortedTools(convertedExtendedTools);
                setTools(convertedExtendedTools);
            }} editButton={<></>} />
            <EditToolsListDialog
                open={dialogOpen}
                dialogTools={dialogTools}
                setDialogTools={setDialogTools}
                dialogListName={dialogListName}
                setDialogListName={setDialogListName}
                setDialogOpen={setDialogOpen}
                setRemoveDialogOpen={setRemoveDialogOpen}
                setList={setList}
                left={(() => {
                    var realLeft: string[] = [];
                    list.forEach(single => {
                        if (single[0] === dialogListName) {
                            single[1].forEach(to => {
                                getToolsList(getTools(get)).forEach(tool => {
                                    if (tool.to === to) {
                                        realLeft.push(tool.name);
                                    }
                                });
                            });
                        }
                    });
                    return realLeft;
                })()} />
            <CheckDialog
                open={removeDialogOpen}
                title={get("category.删除此分类")}
                description={get("category.确定删除此分类吗？")}
                onTrue={() => {
                    var listDraft: lists = list;
                    listDraft.forEach(draftSingle => {
                        if (draftSingle[0] === dialogListName) {
                            listDraft.splice(listDraft.indexOf(draftSingle), 1);
                        }
                    });
                    setList(listDraft);
                    setSetting("lists", "集合列表", JSON.stringify(listDraft));
                    setDialogListName("");
                    return setRemoveDialogOpen(false);
                }}
                onFalse={() => {
                    setDialogListName("");
                    return setRemoveDialogOpen(false);
                }} />
        </Box>
    );
}
