import {
    Metadata
} from "next";
import {
    getRepoInfo
} from "components/getRepoInfo";
export async function generateMetadata() {
    let url = new URL(pack.homepage);
    try {
        url = new URL(process.env.VERKFI_URL)
    } catch {
        console.error(`URL build failed. Using ${url} from homepage in package.json.`);
    }
    const repoInfo = await getRepoInfo(),
        upperName = repoInfo.name.charAt(0).toUpperCase() + repoInfo.name.slice(1);
    return ({
        manifest: "/index.webmanifest",
        metadataBase: url,
        description: repoInfo.description,
        applicationName: upperName,
        other: {
            "msapplication-tooltip": upperName,
            "msapplication-navbutton-color": "#1976d2",
            "msapplication-starturl": "/",
        },
        icons: "/image/favicon.png",
        appleWebApp: {
            title: upperName
        },
        title: {
            default: upperName,
            template: `%s | ${upperName}`
        },
        openGraph: {
            title: upperName,
            description: repoInfo.description,
            url: pack.homepage,
            siteName: upperName,
            images: [
                {
                    url: './image/social.png',
                    width: 1280,
                    height: 640,
                }
            ],
            locale: 'zh_CN',
            alternateLocale: [
                "zh_TW",
                "en_US"
            ]
        },
        authors: pack.author
    }) as Metadata;
}
import {
    Viewport
} from "next";
export function generateViewport(): Viewport {
    return {
        themeColor: "#1976d2",
    };
}
import 'filepond/dist/filepond.min.css'; // Import FilePond styles
import pack from "../../package.json";
import {
    Box,
    GlobalStyles,
    Typography
} from "@mui/material";
import Loading from "loading";
import BaseLayout from "layout/layoutClient";
import {
    AppRouterCacheProvider
} from '@mui/material-nextjs/v13-appRouter';
import Ubuntu from "components/fonts";
import { SWRConfig } from "swr";
import { Suspense } from "react";
export default async function Layout({
    children
}) {
    return (
        <html lang="zh-cmn-Hans-CN">
            <body style={{
                margin: 0,
                scrollbarWidth: "none",
                msOverflowStyle: "none"
            }}>
                <AppRouterCacheProvider>
                    <GlobalStyles styles={{
                        "& *": {
                            fontFamily: Ubuntu.style.fontFamily
                        },
                        "& ::-webkit-scrollbar": {
                            display: "none"
                        },
                        ".filepond--root .filepond--credits": {
                            display: "none"
                        }
                    }} />
                    <noscript>
                        <Loading>
                            <Typography>
                                Error: Unable to execute JavaScript.
                            </Typography>
                        </Loading>
                    </noscript>
                    <Box sx={{
                        minHeight: "100vh"
                    }}>
                        <Suspense fallback={<Loading />}>
                            <BaseLayout>
                                {children}
                            </BaseLayout>
                        </Suspense>
                    </Box>
                </AppRouterCacheProvider>
            </body>
        </html>
    )
};
