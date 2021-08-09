import './App.css';
import axios from 'axios';
import * as _ from 'lodash';
import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      filteredImages: [],
      images: [],
      loading: false,
      searchText: '',
    }
    this.hiddenFileInput = React.createRef();
  }

  componentDidMount = async () => {
    this.setState({
      loading: true,
    });

    try {
      const response = await axios.get('http://localhost:8080/images');
      if (response) {
        this.setState({
          images: response.data.resources,
        });
      }
    } finally {
      this.setState({
        loading: false,
      });

      if (_.size(this.state.images) > 0) {
        this.updateFilteredImages();
      }
    }
  }

  handleChange = async (e) => {
    this.setState({
      loading: true,
    });
    try {
      const formData = new FormData();
      const uploadedFile = e.target.files[0];
      formData.append('image', uploadedFile);

      const response = await axios.post(
        'http://localhost:8080/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response) {
        const images = this.state.images;
        images.push(response.data);
        this.setState({
          images: images,
        });
      }
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  searchTextChangeHandler = (e) => {
    this.setState({
      searchText: e.target.value,
    });

    this.updateFilteredImages();
  }

  updateFilteredImages = () => {
    const filteredImages = [];

    _.forEach(this.state.images, (image) => {
      const imageText = image.public_id.toLowerCase();
      if (_.includes(imageText, this.state.searchText.toLowerCase())) {
        filteredImages.push(image);
      }
    });

    this.setState({
      filteredImages: filteredImages,
    });
  }

  uploadButtonClickHandler = () => {
    this.hiddenFileInput.current.click();
  }

  render() {
    return (
      <div className="app">
        <input
          type="text"
          value={ this.state.searchText }
          onChange={ this.searchTextChangeHandler }
        />
        <button onClick={ this.uploadButtonClickHandler }>Upload</button>
        <input
          type="file"
          ref={ this.hiddenFileInput }
          onChange={ this.handleChange }
          style={{ display: 'none' }}
        />
        {
          this.state.filteredImages.map((image, index) => {
            return <img 
              key={index}
              src={image.url} 
              alt={image.public_id}
            />
          })
        }
      </div>
    )
  }
}

export default App;
