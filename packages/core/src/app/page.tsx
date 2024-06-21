"use client";
import {
    Box,
    Button,
    Collapse,
    Drawer,
    IconButton,
    Toolbar,
    Typography
} from "@mui/material";
import HeadBar from "@verkfi/shared/HeadBar";
import MouseOverPopover from "@verkfi/shared/Popover";
import VerkfiIcon from "@verkfi/shared/verkfiIcon";
import {
    setState
} from "declare";
import convertExtensionTools from "index/convertExtensionTools";
import ToolsStack from "index/showTool";
import Sidebar from "index/sidebar";
import useMostUsedTools from "index/useMostUsedTools";
import recommendAtom from "@verkfi/shared/atoms/recommend";
import {
    useAtom,
    useAtomValue
} from "jotai";
import extensionsAtom from "@verkfi/shared/atoms/extensions";
import {
    recentlyUsedAtom as recentlyUsedAtom,
    showSidebarAtom as showSidebarAtom
} from "@verkfi/shared/atoms";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    drawerWidth
} from "setting/consts";
import {
    type ThemeHaveZIndex
} from "setting/layout";
import toolsInfoAtom, {
    tool
} from "tools/info";
import {
    sortingForAtom,
    sortingForAtomValue,
    tabAtom,
    toolsAtom
} from "index/atoms";
import {
    isImplantContext
} from "index/consts";
export default function Index(props: {
    /**
     * 是否为嵌入
     */
    isImplant?: boolean;
    expand?: boolean;
    setExpand?: setState<boolean>;
}): JSX.Element {
    const realTools = useAtomValue(toolsInfoAtom),
        extensionTools = useAtomValue(extensionsAtom),
        showSidebar = useAtomValue(showSidebarAtom),
        recentlyUsed = useAtomValue(recentlyUsedAtom),
        mostUsed = useMostUsedTools(),
        [expandThis, setExpandThis] = useState<boolean>(false),
        [showTries, setShowTries] = useState<boolean>(false),
        tools = useAtomValue(toolsAtom),
        tab = useAtomValue(tabAtom),
        sortingFor = useAtomValue(sortingForAtom)(props.isImplant),
        baseSortingFor = useAtomValue(sortingForAtomValue),
        focusingTo = tools[tab] ? tools[tab].to : "", // 每次渲染会重新执行
        [recommend, refreshTries] = useAtom(recommendAtom),
        recentlyTools = recentlyUsed.map(to => {
            const converted = convertExtensionTools(extensionTools);
            return 0
                || realTools.find(single => single.to === to)
                || converted.find(single => `/tools/extension?tool=${to}` === single.to);
        }).filter((item: tool | 0) => item !== 0) satisfies unknown satisfies tool[];
    let expand = expandThis,
        setExpand = setExpandThis;
    if (props.setExpand) {
        expand = props.expand;
        setExpand = props.setExpand;
    }
    function Tools() {
        return (
            <Box sx={{
                p: 3,
                ml: props.isImplant ? "" : `${drawerWidth}px`
            }}>
                <ToolsStack
                    paramTool={tools}
                    focus={focusingTo}
                />
            </Box>
        );
    }
    return (props.isImplant ? showSidebar : true) && (
        <isImplantContext.Provider value={Boolean(props.isImplant)}>
            <Box>
                {props.isImplant !== true && (
                    <HeadBar isIndex pageName="Verkfi" sx={{
                        zIndex: theme => String((theme as ThemeHaveZIndex).zIndex.drawer + 1)
                    }} />
                )}
                <Sidebar
                    focusingTo={focusingTo}
                    expand={expand}
                    setExpand={setExpand}
                />
                {sortingFor === "__home__" || baseSortingFor === "__home__" ? (
                    <Box sx={{
                        p: 3,
                        ml: props.isImplant ? "" : `${drawerWidth}px`
                    }}>
                        <Box sx={{
                            paddingBottom: 3,
                            width: "100%",
                            textAlign: "center"
                        }}>
                            <MouseOverPopover text={get("index.generateTry")}>
                                <IconButton aria-label={get("index.generateTry")} onClick={event => {
                                    setShowTries(old => !old);
                                }}>
                                    <VerkfiIcon sx={{
                                        fontSize: "40vw"
                                    }} />
                                </IconButton>
                            </MouseOverPopover>
                        </Box>
                        <Collapse in={showTries}>
                            <Box>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "space-between"
                                }}>
                                    <Typography variant="h4">
                                        {get("index.trythese")}
                                    </Typography>
                                    <Button onClick={event => refreshTries()}>
                                        {get("index.newTries")}
                                    </Button>
                                </Box>
                                <Box sx={{
                                    p: 1
                                }}>
                                    <ToolsStack
                                        paramTool={recommend.filter(item => item !== undefined)} />
                                </Box>
                            </Box>
                        </Collapse>
                        <Box>
                            <Typography variant="h4">
                                {get("use.最近使用")}
                            </Typography>
                            <Box sx={{
                                p: 1
                            }}>
                                <ToolsStack
                                    paramTool={recentlyTools.filter(item => item !== undefined)} />
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="h4">
                                {get("use.最常使用")}
                            </Typography>
                            <Box sx={{
                                p: 1
                            }}>
                                <ToolsStack
                                    paramTool={mostUsed}
                                />
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    props.isImplant ? (
                        expand && (
                            <Drawer anchor="left" variant="permanent" sx={{
                                flexShrink: 0,
                                [`& .MuiDrawer-paper`]: {
                                    position: "absolute",
                                    left: drawerWidth,
                                    maxWidth: `calc(100vw - ${drawerWidth}px)`,
                                    width: 320,
                                    boxSizing: "border-box"
                                }
                            }}>
                                <Toolbar />
                                <Tools />
                            </Drawer>
                        )
                    ) : <Tools />
                )}
            </Box>
        </isImplantContext.Provider>
    );
}
