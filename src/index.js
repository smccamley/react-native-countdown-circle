import React, { Component, PropTypes } from 'react'
import {
  Easing,
  Animated,
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

// compatability for react-native versions < 0.44
const ViewPropTypesStyle = ViewPropTypes
  ? ViewPropTypes.style
  : View.propTypes.style

let itterations = 0


const styles = StyleSheet.create({
  outerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
  },
  innerCircle: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  leftWrap: {
    position: 'absolute',
    top: 0,
  },
  halfCircle: {
    position: 'absolute',
    top: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#f00',
  },
})

function calcInterpolationValuesForHalfCircle1(animatedValue, { shadowColor }) {
  const rotate = animatedValue.interpolate({
    inputRange: [0, 50, 50, 100],
    outputRange: ['0deg', '180deg', '180deg', '180deg'],
  })

  const backgroundColor = shadowColor
  return { rotate, backgroundColor }
}

function calcInterpolationValuesForHalfCircle2(animatedValue, { color, shadowColor },) {
  const rotate = animatedValue.interpolate({
    inputRange: [0, 50, 50, 100],
    outputRange: ['0deg', '0deg', '180deg', '360deg'],
  })

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 50, 50, 100],
    outputRange: [color, color, shadowColor, shadowColor],
  })
  return { rotate, backgroundColor }
}

function getDuration(props){
  let endTime = (new Date(props.endTime)).getTime()
  let startTime = (new Date(props.startTime)).getTime()

  let s = 1000
  let m = s*60
  let h = m*60
  let d = h*24
  
  let duration = 0
  let dif = endTime - startTime
  
  // if(dif >= d){
  //   duration = d
  // }else 
  if(dif >= h){
    duration = h
  }else if(dif >= m){
    duration = m
  }else if(dif >= s){
    duration = s
  }

  return duration
}

function getRelativeDuration(props){
  let endTime = (new Date(props.endTime)).getTime()
  let startTime = (new Date()).getTime()

  let s = 1000
  let m = s*60
  let h = m*60
  let d = h*24
  
  let duration = 0
  let dif = endTime - startTime
  
  // if(dif >= d){
  //   duration = d
  // }else 
  if(dif >= h){
    duration = h
  }else if(dif >= m){
    duration = m
  }else if(dif >= s){
    duration = s
  }

  return duration
}


function getItterations(props){
  let itterations = 0

  let endTime = (new Date(props.endTime)).getTime()
  let startTime = (new Date(props.startTime)).getTime()

  let s = 1000
  let m = s*60
  let h = m*60
  let d = h*24
  
  let duration = 0
  let dif = endTime - startTime
  let addedItterations = 0

  
  let numOfSeconds = parseInt(dif/s)
  let numOfMins = parseInt(dif/m)
  let numOfHours = parseInt(dif/h)

  //console.log('nums',numOfHours, numOfMins, numOfSeconds)
  
  if(numOfSeconds>60){
    if(numOfMins>60){
        itterations = 60+60+numOfHours
    }else{
      itterations = numOfMins + 60
    }
  }else{
    itterations = numOfSeconds
  }
  
  return itterations + 1
}



function initItterations(props){
  let totalItterations = [
    0, // days
    0, // hours
    0, // mins
    0, // seconds
  ]
  let endTime = (new Date(props.endTime)).getTime()
  let startTime = (new Date(props.startTime)).getTime()
  let dif = endTime - startTime

  let s = 1000
  let m = s*60
  let h = m*60
  let d = h*24
  
  let numOfSeconds = parseInt(dif/s)
  let numOfMins = parseInt(dif/m)
  let numOfHours = parseInt(dif/h)
  
  if(numOfSeconds>60){
    if(numOfMins>60){
        totalItterations[1] = numOfHours
        totalItterations[2] = 60
        totalItterations[3] = 60
    }else{
      totalItterations[2] = numOfMins
      totalItterations[3] = 60
    }
  }else{
    totalItterations[3] = numOfSeconds
  }
  //console.log('totalItterations', totalItterations)
  return totalItterations
}

function initDepreciatingItterations(props){
  let totalItterations = [
    0, // days
    0, // hours
    0, // mins
    0, // seconds
  ]
  let endTime = (new Date(props.endTime)).getTime()
  let startTime = (new Date()).getTime()
  let dif = endTime - startTime

  let s = 1000
  let m = s*60
  let h = m*60
  let d = h*24
  
  let numOfSeconds = parseInt(dif/s)
  let numOfMins = parseInt(dif/m)
  let numOfHours = parseInt(dif/h)
  
  if(numOfSeconds>60){
    if(numOfMins>60){
      totalItterations[1] = numOfHours+1
      totalItterations[2] = 59
      totalItterations[3] = 59
    }else{
      totalItterations[2] = numOfMins+1
      totalItterations[3] = 59
    }
  }else{
    totalItterations[3] = numOfSeconds+1
  }
  //console.log('totalItterations', totalItterations)
  return totalItterations
}

function getCurrentProgress(props){
  let startTime = (new Date()).getTime()
  let endTime = (new Date(props.endTime)).getTime()

  let difference = endTime - startTime
  let gap = getDuration(props)
  let currentGap = difference % gap
  let currentProgress = ((currentGap / gap) * 100)

  return 100 - currentProgress
}

function getStep(props){
  let duration = getRelativeDuration(props)
  switch(duration){
    case 1000:
      return "Seconds"
    case 60000 :
      return "Minutes"
    case 3600000 :
      return "Hours"
    case 86400000 :
      return "Days"
    default :
      return "Time"
  }
}

function getState(props, circleProgress){
  let itterations = getItterations(props)
  let totalItterations = initItterations(props)
  let totalDepreciatingItterations = initDepreciatingItterations(props)
  
  return {
    circleProgress,
    itterationsElapsed: 0,
    descriptionText: props.descriptionText,
    step: getStep(props),
    //text: props.updateText(0, props.itterations),
    text: props.updateText(0, totalItterations, totalDepreciatingItterations),
    interpolationValuesHalfCircle1: calcInterpolationValuesForHalfCircle1(
      circleProgress,
      props,
    ),
    interpolationValuesHalfCircle2: calcInterpolationValuesForHalfCircle2(
      circleProgress,
      props,
    ),
    itterations,
    totalItterations,
    totalDepreciatingItterations
  }
}

function getInitialState(props) {
  const circleProgress = new Animated.Value(getCurrentProgress(props))
  return getState(props, circleProgress)
}

function getNextState(props, state) {
  const circleProgress = new Animated.Value(0)
  return getState(props, circleProgress)
}













export default class PercentageCircle extends Component {
  static propTypes = {
    radius: PropTypes.number.isRequired,
    color: PropTypes.string,
    shadowColor: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    bgColor: PropTypes.string,
    borderWidth: PropTypes.number,
    containerStyle: ViewPropTypesStyle,
    textStyle: Text.propTypes.style,
    updateText: PropTypes.func,
    onTimeElapsed: PropTypes.func,
    startTime:PropTypes.string,
    endTime:PropTypes.string,
    descriptionText: PropTypes.string,
    descriptionTextStyle: Text.propTypes.style,
    descriptionTextComplete: PropTypes.string
  };

  static defaultProps = {
    color: '#f00',
    shadowColor: '#999',
    bgColor: '#e9e9ef',
    borderWidth: 2,
    children: null,
    containerStyle: null,
    textStyle: null,
    descriptionText:null,
    descriptionTextComplete:null,
    onStepChange: () => null,
    onTimeElapsed: () => null,
    updateText: (elapsedItterations, itterations, totalItterations, x) => {

      if(x){
        return x.toString()
      }else{
        let text = false
        totalItterations.map((timeType, i) => {
          
          if(!text){
            if(timeType == 0){
              return
            }else{
              text = String(totalItterations[i])
            }
          }
        })
        return text
      }
    },
  };

  constructor(props) {
    super(props)

    initItterations(props)
    this.state = getInitialState(props)
    
  }

  componentWillReceiveProps(nextProps, elser) {
    this.setState(getInitialState(nextProps), this.restartAnimation)
  }

  totalDepreciatingItteration(state, itterationsElapsed){

    let currentGroup = false
    state.totalDepreciatingItterations.map((it,i) => {
      if((it != 0) && !currentGroup){
        currentGroup = i
      }
    })

    // props.totalDepreciatingItterations[i] 1,2,3,4,5,6

    let textvalue = state.totalDepreciatingItterations[currentGroup] -1
    if(textvalue == 1 && (currentGroup != 3)){ 
      textvalue = state.totalDepreciatingItterations[currentGroup+1]+1
    }

    return textvalue
  }

  onCircleAnimated = () => {
    const itterationsElapsed = this.state.itterationsElapsed + 1
    const callback = itterationsElapsed < this.state.itterations
    ? this.restartAnimation
    : this.props.onTimeElapsed
    
    //console.log('totalItterations', itterationsElapsed < this.state.itterations, this.state.itterations, itterationsElapsed, itterations)
    const updatedText = this.props.updateText(
      itterationsElapsed,
      this.state.totalItterations,
      this.state.totalDepreciatingItterations,
      this.totalDepreciatingItteration(this.state, itterationsElapsed)
    )
    this.setState(
      {
        ...getNextState(this.props),
        step: getStep(this.props),
        itterationsElapsed,
        text: updatedText,
      },
      callback,
    )
  };

  restartAnimation = (initial) => {
    let duration = 1000
    //console.log('duration',duration)
    if(initial){
      duration = ((100 - getCurrentProgress(this.props)) / 100) * getDuration(this.props)
    }else{
      duration = getRelativeDuration(this.props)
    }
    this.state.circleProgress.stopAnimation()
    Animated.timing(this.state.circleProgress, {
      toValue: 100,
      duration: duration,
      easing: Easing.linear,
    }).start(this.onCircleAnimated)
  };

  componentDidMount(){
    // this.setState({})
    this.restartAnimation(true)
  }

  renderHalfCircle({ rotate, backgroundColor }) {
    const { radius } = this.props

    return (
      <View
        style={[
          styles.leftWrap,
          {
            left: radius,
            width: radius,
            height: radius * 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.halfCircle,
            {
              left: -radius,
              width: radius,
              height: radius * 2,
              borderRadius: radius,
              backgroundColor,
              transform: [
                { translateX: radius / 2 },
                { rotate },
                { translateX: -radius / 2 },
              ],
            },
          ]}
        />
      </View>
    )
  }

  renderInnerCircle() {
    const radiusMinusBorder = this.props.radius - this.props.borderWidth
    return (
      <View
        style={[
          styles.innerCircle,
          {
            width: radiusMinusBorder * 2,
            height: radiusMinusBorder * 2,
            borderRadius: radiusMinusBorder,
            backgroundColor: this.props.bgColor
          },
        ]}
      >
        <Text style={this.props.textStyle}>
          {this.state.text}
        </Text>
      </View>
    )
  }

  renderDescriptionText(){
    return (
      <View>
        {this.state.step != "Time" && 
          <Text style={this.props.descriptionTextStyle}>{this.state.step} {this.props.descriptionText}</Text>
        }
        {this.state.step == "Time" && 
          <Text style={[this.props.descriptionTextStyle, {color:"#848484"}]}>{this.props.descriptionTextComplete}</Text>
        }
      </View>
    )
  }

  render() {
    const {
      interpolationValuesHalfCircle1,
      interpolationValuesHalfCircle2,
    } = this.state
    return (
      <View style={this.props.containerStyle}>
        {this.state.step != "Time" && 
          <View
            style={[
              styles.outerCircle,
              {
                width: this.props.radius * 2,
                height: this.props.radius * 2,
                borderRadius: this.props.radius,
                backgroundColor: this.props.color,
              },
            ]}
          >
            {this.renderHalfCircle(interpolationValuesHalfCircle1)}
            {this.renderHalfCircle(interpolationValuesHalfCircle2)}
            {this.renderInnerCircle()}
          </View>
        }
        {this.state.step == "Time" && 
          <Icon name="times" size={14} color="#848484" style={{paddingBottom:4,paddingRight:6,paddingLeft:6,paddingTop:4}}/>
        }
        {this.renderDescriptionText()}
      </View>
    )
  }
}
