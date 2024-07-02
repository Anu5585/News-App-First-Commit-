import React, { Component } from "react";
import Newsitem from "./Newsitem";
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";
import Spiner from './Spiner';





export class News extends Component {
  static defaultProps = {
    country: 'pk',
    pageSize: 8,
    category: 'general'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  async updateNews() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c468d9831559432cb68d4e0744606637&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let pasrseData = await data.json();
    this.props.setProgress(70);
    
    this.setState({ articles: pasrseData.articles, totalResults: pasrseData.totalResults, loading: false });
    this.props.setProgress(100);
  }

  constructor(props) {
    super(props);
   
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    };
    document.title = `${this.props.category} - NewsMonkey`;
  }

  async componentDidMount() {
    this.updateNews();
  }

  handleNextClick = async () => {
    this.setState({ page: this.state.page + 1 })
    this.updateNews()
  }

  handlePrevClick = async () => {
    if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1 })
      this.updateNews()
    }
  }

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 })
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c468d9831559432cb68d4e0744606637&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let pasrseData = await data.json();

    this.setState((prevState) => ({
      articles: [...prevState.articles, ...pasrseData.articles],
      totalResults: pasrseData.totalResults,
      loading: false
    }));
  };

  render() {
    return (
      <>
        <h1 className="text-center">NewsMonkey - Top {this.props.category} Headlines</h1>
        {this.state.loading && <spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<spinner />}
        >
          <div className="container">
            <div className="row">
              {this.state.articles.map((element) => {
                return <div className="col-md-4" key={element.url}>
                  <Newsitem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                </div>
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }
}

export default News;