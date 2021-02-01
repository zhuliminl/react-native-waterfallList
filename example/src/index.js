import React from 'react'
import { View, Image, StatusBar, Text, RefreshControl, TouchableOpacity, Alert, FlatList, Dimensions, ScrollView, NativeModules, Platform } from 'react-native'
import Waterfall from 'react-native-waterfall-list'
import { getRandomData, guid, getRandomImageUri, generateRandomWords } from './utils'

const { width, height } = Dimensions.get('window')
const $pt = (value) => (value * width) / 375


class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      isRefreshing: false,
    }
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.addMoreData(getRandomData(30))
    }, 100);

    // setInterval(() => {
    //   this.addMoreData(getRandomData(30))
    // }, 3000);
  }

  addMoreData = (data) => {
    if (this._waterfallRef) {
      this._waterfallRef.addMoreData(data)
    }
  }


  _captureRef = ref => {
    this._waterfallRef = ref
  }

  renderEmpty = () => {
    return (<View style={{ height: 300, backgroundColor: '#999' }}><Text>列表为空</Text></View>)
  }

  renderHeader = () => {
    return (<View style={{ height: 60, backgroundColor: 'red' }}><Text>头部</Text></View>)
  }

  renderFooter = () => {
    return (<View style={{ height: 60, backgroundColor: 'green' }}><Text>底部</Text></View>)
  }

  onEndReached = () => {

  }

  onRefresh = () => {

  }

  onViewableItemsChanged = () => {

  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={{
        overflow: 'hidden',
        borderRadius: 8,
        height: item.height || 0,
        backgroundColor: item.backgroundColor,
      }}>
        {/* <Text>{item.title || ''}</Text> */}
        <Image
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
          }}
          source={{ uri: item.imageUrl || '' }}
        />
      </View>
    )
  }

  _keyExtractor = (item, index) => {
    return index
  }

  refresh = () => {

  }

  render() {
    return (
      <View>
        <Waterfall
          // ListHeaderComponent={this.renderHeader}
          // ListFooterComponent={this.renderFooter}
          // ListEmptyComponent={this.renderEmpty}
          onEndReached={this.onEndReached}
          onRefresh={this.onRefresh}
          onViewableItemsChanged={this.onViewableItemsChanged}
          refreshing={false}

          ref={this._captureRef}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}

          numColumns={2}
          gap={10}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.refresh}
            />
          }


        // 测试接口
        // onScroll={e => {
        // }}


        />
      </View>
    )
  }
}


export default Home
