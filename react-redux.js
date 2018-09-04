import React, { Component } from 'react'
import PropTypes from 'prop-types'

const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => class HigherOrderComponent extends Component{
  static contextTypes = {
    store: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)

    this.store = context.store
    this.unSubscribe = () => {}

    this.state = { ...this._getContextState() }
  }

  componentDidMount () {
    this.unSubscribe = this.store.subscribe(() => this.setState({ ...this._getContextState() }))
  }

  componentWillUnmount () {
    this.unSubscribe()
  }

  _getContextState () {
    return mapStateToProps(this.store.getState())
  }

  render () {
    const dispatchToProps = mapDispatchToProps(this.store.disPatch)

    return <WrappedComponent { ...this.state, { ...dispatchToProps } } />
  }
}

class Provider extends Component{
  static childContextTypes = {
    store: PropTypes.object
  }

  static propTypes = {
    store: PropTypes.object
  }

  getChildContext () {
    return {
      store: this.props.store
    }
  }

  render () {
    return this.props.children
  }
}

export { Provider, connect }
