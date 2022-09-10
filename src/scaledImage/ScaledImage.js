import React, { Component, PropTypes } from "react";
import { Image } from "react-native";
import Logomap from './categoryLogoImage';


// Changes to make - Check warning being caused in list view
export default class ScaledImage extends Component {
constructor(props) {
    super(props);
    this.state = { 
        source: { uri: this.props.uri },
        width: 0,
        height: 0 
    };
    // this.updateImage();
}

componentDidMount() {
    this.updateImage();
}

updateImage() {
    // Call this only when you have a valid uri
    if(this.props.uri === "") {

    }
    else if(this.props.uri === "no image") {
        // Uri is "no image"

        // Case 1 : If category is pased as a prop (i.e, this.props.category is a nonempty string)
            // Need to show default logos as Image
            // All Logos are square, so make the width and height equal 
            // Make sure that logo pics are square if they're being changed
            // Make sure that atleast one of heigth and width is given to the ScaledImage when used

        // Case 2 : If category is not passed as a prop
            // Just leave both height and width to be zero and don't do any state change
            // This displays no image

        if(this.props.category && this.props.category!=="") {
            this.setState({ source : Logomap.get(this.props.category) });
            
            if (this.props.width && !this.props.height) {
                this.setState({
                    width: this.props.width,
                    height: this.props.width
                });
            } else if (!this.props.width && this.props.height) {
                this.setState({
                    width: this.props.height,
                    height: this.props.height
                });
            } else {
                this.setState({ width: 100, height: 100 });
            }
        }
        else {
            
        }
    }
    else {
        // Uri is a remote firebase link for image
        // No sub conditions, so just get the heigth and width and calculate new aspect ratio

        this.setState({ source: { uri: this.props.uri} });
        Image.getSize(this.props.uri, (width, height) => {
            if (this.props.width && !this.props.height) {
                this.setState({
                    width: this.props.width,
                    height: height * (this.props.width / width)
                });
            } else if (!this.props.width && this.props.height) {
                this.setState({
                    width: width * (this.props.height / height),
                    height: this.props.height
                });
            } else {
                this.setState({ width: width, height: height });
            }
        });
    }
}

render() {
    return (
        <Image
            source={this.state.source}
            style={{ height: this.state.height, width: this.state.width, borderRadius: 0, marginBottom: '2%' }}
        />
    );
}
}

// ScaledImage.propTypes = {
// uri: PropTypes.string.isRequired,
// width: PropTypes.number,
// height: PropTypes.number
// };