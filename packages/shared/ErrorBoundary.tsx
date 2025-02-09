import Error from "@verkfi/core-ui/src/error";
import {
    Component,
    ReactNode
} from "react";
interface prop {
    hasError?: boolean;
    error?: Error;
    children?: ReactNode;
}
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: new globalThis.Error()
        } satisfies prop;
    }
    static getDerivedStateFromError(error) {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return {
            hasError: true,
            error: error
        };
    }
    componentDidCatch(error, errorInfo) {
        // 你同样可以将错误日志上报给服务器
        console.error(error, errorInfo);
    }
    render() {
        if ((this.state as prop).hasError === true) {
            debugger; // 发生错误时自动开启调试
            // 你可以自定义降级后的 UI 并渲染
            return (
                <Error error={(this.state as prop).error} reset={() => null} />
            );
        }
        return (this.props as prop).children;
    }
}
