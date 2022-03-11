import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {

    static defaultProps = {
        country: 'in',
        pageSize: 8,
        category: 'general'
    };

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalPages: 0
        }
        document.title = `${this.props.category.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) { return m.toUpperCase() })} - News Monkey`;
    };

    async updateNews() {
        this.props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            articles: parsedData.articles,
            totalPages: parsedData.totalResults,
            loading: false
        });
        this.props.setProgress(100);
    };

    async componentDidMount() {
        this.updateNews();
    };

    // handlePrevClick = async () => {
    //     this.setState({
    //         page: this.state.page - 1
    //     }, () => {
    //         this.updateNews();
    //     })
    // };

    // handleNextClick = async () => {
    //     this.setState({
    //         page: this.state.page + 1
    //     }, () => {
    //         this.updateNews();
    //     })
    // };

    fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
        this.setState({ page: this.state.page + 1 });
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalPages: parsedData.totalResults,
        });
    };

    render() {
        return (
            <>
                <h1 className="text-center" style={{margin:'35px 0px', marginTop: '90px'}}>NewsMonkey - Top {this.props.category.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) { return m.toUpperCase() })} Headlines</h1>
                {this.state.loading && <Spinner />}
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length != this.state.totalPages}
                    loader={<Spinner />}
                >
                    <div className="container">
                        <div className="row">
                            {/* {!this.state.loading && this.state.articles.map((element) => { */}
                            {this.state.articles.map((element) => {
                                return (
                                    <div className="col-md-4" key={element.url}>
                                        <NewsItem title={(element.title) ? element.title : ""} description={(element.description) ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={(element.author) ? element.author : "Unknown"} date={(element.publishedAt) ? element.publishedAt : ""} source={(element.source.name) ? element.source.name : "N/A"} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
                {/* <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
                    <button disabled={this.state.page > Math.ceil(this.state.totalPages / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div> */}
            </>
        )
    }
}

export default News
