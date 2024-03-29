import React from 'react';
import axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';
import Article from '../components/Article/Article';
import CheckToken from '../functions/CheckToken';
import HomeNavigation from '../components/Navigation/HomeNavigation';


const instance = axios.create({
    baseURL: '/',
    adapter: cacheAdapterEnhancer(axios.defaults.adapter,
        {enabledByDefault: false}),
})


class Home extends React.Component {
    state = {
        isLoading: true,
        articles: [],
        nickname: '',
    };

    getArticles = async () => {
        await instance.get("https://vvoary23fi.execute-api.ap-northeast-2.amazonaws.com/default/getPhilArticle",
        { forceUpdate: this.props.history.action === 'POP', cache: true})
        .then(resp => {
            // CheckToken(resp.config.headers.Authorization);
            const articles = resp.data.body;
            const sortedArticles = articles.sort((a, b) => new Date(b.published) - new Date(a.published));
            const nickname = window.localStorage.getItem('nickname')
            this.setState({ articles: sortedArticles, isLoading: false, nickname:nickname })
        });
    };

    componentDidMount() {
        this.getArticles();
        const token = window.localStorage.getItem('Token');
        CheckToken(token);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     const vitalPropsChange = this.props !== nextProps;
    //     const vitalStateChange = this.state !== nextState;
    //     return vitalPropsChange || vitalStateChange;
    // }
    
    componentDidCatch(error, info) {
        console.error(error, info);
        alert(error, info);
    }

    componentWillUnmount() {
    }

    render() {
        const { isLoading, articles, nickname } = this.state;
        return (
            <section className="container">
                {isLoading ? (
                    <div className="loader">
                        <span className="loader__text">Loading...</span>
                    </div>
                ) : (
                    <>
                    <HomeNavigation />
                    {nickname ? (
                        <div className="nickname">Welcome, {nickname}</div>
                    ) : (
                        <div className="nickname">Please Login</div>
                    )}
                    <div className="articles">
                        {articles
                        .map(article => (
                            <Article key={article.id} id={article.id} name={article.name} title={article.title} published={article.published} link={article.link} comments={article.comments} />
                        ))}
                    </div>
                    </>
                )}
            </section>
        );
    }
}

export default Home;