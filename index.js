import React from 'react'
import { Dimensions, Image, View, StyleSheet, VirtualizedList, Text, ScrollView } from 'react-native'

const { width } = Dimensions.get('window')


class Waterfall extends React.Component {
  static defaultProps = {
    numColumns: 2,
    onEndReachedThreshold: 0.1,
    gap: 5,
    keyExtractor: (item, index) => {
      if (item.key != null) {
        return item.key
      }
      if (item.id != null) {
        return item.id
      }

      return String(index);
    },

  }


  constructor(props) {
    super(props)
    const { refreshing, numColumns } = this.props
    let data = [...Array(numColumns)].map(_ => [])

    this.state = {
      data,
    }
  }

  checkHasData = () => {
    const { data = [] } = this.state
    let hasData = false
    data.forEach(columns => {
      columns.forEach(item => {
        if (item) {
          hasData = true
        }
      })
    })
    return hasData
  }

  clearData = () => {
    this.setState({
      data: this.state.data.map(columns => ([]))
    })
  }

  addMoreData = (items = []) => {
    const startTime = new Date().getTime()
    const { numColumns } = this.props

    // 为当前 items 放置位置而设计的数据块 _data
    let _data = [...Array(numColumns)].map(_ => [])


    let dataDimensions = this.state.data.map(columns => columns.map(item => ({ height: item.height || 0 })))

    items.forEach((item, index) => {
      // 获得到待放置位置的 column 索引
      const readyColumnIndex = this.getReadyColumnIndex(dataDimensions)

      _data[readyColumnIndex].push(item)
      dataDimensions[readyColumnIndex].push({ height: item.height || 0 }) // 对当前分配的位置的下一次计算，进行补加
    })

    // 位置分配结束
    this.setState({
      data: this.state.data.map((lastColumnData, columnIndex) => {
        return lastColumnData.concat(_data[columnIndex])
      })
    }, () => {
      const overTime = new Date().getTime()
      console.log('saul 位置分配耗时', overTime - startTime)
    })
  }

  getReadyColumnIndex = (dimensions = []) => {
    const columnsTotalHeights = dimensions.map(columnDimensions => columnDimensions.map(_ => _.height).reduce((x, y) => x + y, 0))
    const minHeights = Math.min(...columnsTotalHeights)
    const minIndex = columnsTotalHeights.indexOf(minHeights)
    return minIndex
  }


  componentDidMount = async () => {
  }

  _captureRef = ref => {
    this._listRef = ref;
  }

  _keyExtractor = (items, index) => {
    const { keyExtractor } = this.props
    return keyExtractor(items, index)
  }

  _getItem = (data, index, columnIndex) => {
    return data[index]
  }

  _getItemCount = (data, index) => {
    return data.length || 0
  }


  _renderItem = ({ item, index }) => {
    const { renderItem, gap } = this.props
    // return renderItem({ item, index })
    return (
      <View style={{
        marginBottom: gap,
      }}>
        {renderItem({ item, index })}
      </View>
    )
  }


  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    console.log('saul layoutMeasrement.height & contentSize.height', layoutMeasurement.height, contentSize.height)

    if(layoutMeasurement.height > contentSize.height) {
      return false
    }
    const { onEndReachedThreshold = 0.1 } = this.props
    const visibleLength = layoutMeasurement.height
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - onEndReachedThreshold * visibleLength
  }

  isLeaveToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const { onEndReachedThreshold = 0.1 } = this.props
    const visibleLength = layoutMeasurement.height
    return layoutMeasurement.height + contentOffset.y < contentSize.height - onEndReachedThreshold * visibleLength
  }

  onEndReached = (e) => {
    const { onEndReached } = this.props;
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent
    const distanceFromEnd = contentSize.height - layoutMeasurement.height - contentOffset.y
    onEndReached && onEndReached({ distanceFromEnd })
  }

  onScroll = (e) => {
    const { onScroll } = this.props;
    onScroll && onScroll(e)

    if (this.isLeaveToBottom(e.nativeEvent)) {
      console.log('saul 0000000')
      this.hasReachedEnd = false
    }

    if (this.hasReachedEnd) {
      return
    }

    if (this.isCloseToBottom(e.nativeEvent)) {
      console.log('saul =====>>>>>>>> isCloseToBottom', e.nativeEvent)
      this.hasReachedEnd = true
      this.onEndReached(e)
    }
  }



  render() {
    const {
      ListEmptyComponent = () => null,
      ListHeaderComponent = () => null,
      ListFooterComponent = () => null,
      style = {}
    } = this.props

    const emptyElement = React.isValidElement(ListEmptyComponent) ? (ListEmptyComponent) : (<ListEmptyComponent />)
    const headerElement = React.isValidElement(ListHeaderComponent) ? (ListHeaderComponent) : (<ListHeaderComponent />)
    const footerElement = React.isValidElement(ListFooterComponent) ? (ListFooterComponent) : (<ListFooterComponent />)


    return (
      <ScrollView
        style={[styles.container, { ...style }]}
        {...this.props}
        onScroll={this.onScroll}
      >
        {
          headerElement
        }
        {
          !this.checkHasData() && emptyElement
        }
        <View
          style={[styles.row, {}]}
        >
          {
            this.state.data.map((columnsData, columnIndex) => {
              const { gap = 0, numColumns } = this.props
              const isLastColumn = columnIndex + 1 === numColumns
              return (
                <VirtualizedList
                  style={[{}, {
                    marginLeft: gap,
                    marginRight: isLastColumn ? gap : 0,
                  }]}
                  key={columnIndex}
                  keyExtractor={this._keyExtractor}
                  getItem={(item, index) => this._getItem(item, index, columnIndex)}
                  getItemCount={this._getItemCount}
                  data={columnsData}
                  renderItem={this._renderItem}
                />
              )
            })
          }
        </View>
        {
          footerElement
        }
      </ScrollView>
    )

  }
}

const styles = StyleSheet.create({
  container: {
  },
  row: {
    flexDirection: 'row',
  }
})

export default Waterfall
