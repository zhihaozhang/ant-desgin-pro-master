import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import styles from './index.scss';
import Cards from '@/components/Cards';
import HeaderSearch from '@/components/HeaderSearch';

// @ts-ignore
@connect(({ global }) => ({
  global,
}))

// eslint-disable-next-line react/prefer-stateless-function,@typescript-eslint/class-name-casing
class favorites extends React.Component {
  state = {
    pageName: '',
    buttonGroup: [],
    searchResult: '',
    startIndex: 0,
    endIndex: 20,
  };

  componentDidMount(): void {
    if(localStorage.getItem('solutionGroup')){
      const { solutionGroup } = JSON.parse(localStorage.getItem('solutionGroup') as string);
      const favoritesArr: any[] | never[] = [];
      solutionGroup.forEach(item => {
        item.solutionSonGroup.forEach(items => {
          if (items.collected) {
            favoritesArr.push(items)
          }
        })
      })
      this.setState({
        pageName: this.props.match.params.name,
        buttonGroup: favoritesArr,
      })
    }
  }

  // nextPage = () => {
  //   if(this.state.startIndex + 20 <= this.state.buttonGroup.length) {
  //     this.setState({
  //       startIndex: this.state.startIndex + 20,
  //       endIndex: this.state.endIndex + 20,
  //     })
  //   }
  // }
  searchHandle = (value: any) => {
    console.log(value)
    this.setState({
      searchResult: value,
    })
  }

  routerButtonClick = (url: string | undefined) => {
    window.open(url)
  }

  render() {
    const { buttonGroup, searchResult, startIndex, endIndex } = this.state;
    return (
      <div className="overview">
        <div style={{ overflow: 'hidden' }}>
          <h1 style={{ marginLeft: '1.5%', float: 'left', fontSize: '20px', marginRight: '40px', color:'rgba(255, 255, 255, 0.65)' }}>收藏夹</h1>
          <HeaderSearch searchHandle={this.searchHandle}/>
        </div>
        <div className={styles.resultWrap}>
          {
            buttonGroup.map((item, index) => {
              // eslint-disable-next-line react/jsx-no-bind
              const groupIndex = parseInt(index);
              // 可能分页
              if (groupIndex >= startIndex && groupIndex < endIndex) {
                // 搜索结果过滤
                if (!searchResult || buttonGroup[index].name.indexOf(searchResult) !== -1) {
                  // eslint-disable-next-line max-len
                  // @ts-ignore
                  // eslint-disable-next-line max-len
                  return <Cards content={buttonGroup[index].name} opacityTime={parseInt(index)*100} state={buttonGroup[index].state} handleClick={this.routerButtonClick.bind(this, buttonGroup[index].url)}/>
                } return null
              } return null
            })
          }
        </div>
      </div>
    );
  }
}
export default connect(({ global }: ConnectState) => ({
  solutionGroup: global.solutionGroup, solutionRouter: global.solutionRouter,
}))(favorites);
