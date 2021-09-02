import React from "react";

class ImageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false, repeat: false };
  }
  
  handleImageError = (e) => {
    this.setState({ error: true });
    // console.clear();
    if (this.state.error) this.setState({repeat: true});
  }

  render() {
    return (
        <img
          id={this.props.id}
          alt="logo" 
          style={{width: "24px"}}
          src={this.state.error ? (this.state.repeat ? "/assets/images/zero.png" : "https://logos.covalenthq.com/tokens/"+ this.props.address +".png") : "https://exchange.uniswap.finance/images/coins/" + this.props.address.toLowerCase() + ".png"}
          onError={this.handleImageError}
        />
    );
  }
}

export default ImageComponent;
