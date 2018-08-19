import React from 'react';

/**
 * Takes the given object/map of key -> observables, subscribes to those 
 * observables, takes the emitted data from each observable and passes it 
 * down as a prop to the wrapped component. The prop names are they key names
 * from the observable map.  The subscriptions are cleaned up when the 
 * component is unmounted.
 * 
 * @param {} WrappedComponent 
 * @param {*} observablesMap 
 */
export default function withObservables(WrappedComponent, observablesMap) {
    var subscriptions = [];

    return class extends React.Component {
        constructor(props) {
        super(props);
        this.state = {};
        }

        componentDidMount() {
        for (var key in observablesMap) {
            subscriptions.push(observablesMap[key].subscribe((data) => {
                this.setState({
                    [key]: data
                });
            }));
            }
        }

        componentWillUnmount() {
            subscriptions.forEach((sub) => {
                sub.unsubscribe();
            });
        }

        render() {
        //Pass down any props passed to us as well as all the observable data on state
        return <WrappedComponent {...this.state} {...this.props} />;
        }
    };
}