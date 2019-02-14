
import React, { lazy, Suspense,Fragment } from "react";

class Article extends React.Component {
    static state = {
    }
    static defaultProps = {
    }
    state = {
        showArticle: false
    }
    constructor(props) {
        super(props);
        this.main = React.createRef();

    }
    componentDidMount(){
        console.log('load asynchronous article');
        // 异步加载文章
        setTimeout(()=>{
            this.setState({ showArticle:true });
        },3000);
        setTimeout(()=>{
            throw new Error('I crashed!');
        },8000);
    }
    render() {
        throw new Error('I crashed!');
        return (
            // this.state.showArticle &&
            <Fragment>

                Asynchronous Article
                {/*<img src='https://res.cloudinary.com/practicaldev/image/fetch/s--NMj7GQ4g--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/vny00707uw21l6jlpf8d.gif'/>*/}
            </Fragment>
        )
    }
}

export default Article;