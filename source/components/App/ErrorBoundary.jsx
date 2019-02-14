import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.main = React.createRef();
        this.state = {
            error: null,
            errorInfo: null
        };
    }
    componentDidCatch(error,errorInfo){
        this.setState({
            error,errorInfo
        })
    }
    render() {
        if(this.state.errorInfo){
            return (
                <section>
                    抱歉，代码错误
                    <h2>{ String(this.state.error) }</h2>
                    <div>{ this.state.errorInfo.componentStack }</div>
                </section>
            )
        }
        return this.props.children;
    }
}

export default ErrorBoundary;