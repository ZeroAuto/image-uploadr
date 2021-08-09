import './App.css';
import axios from 'axios';
import * as _ from 'lodash';
import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      errors: [],
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
    await this.setState({
      loading: true,
      errors: [],
    });

    const errors = [];
    try {
      const types = ['image/png', 'image/jpeg'];
      const formData = new FormData();
      const uploadedFile = e.target.files[0];

      // allow for some error handling
      if (!_.includes(types, uploadedFile.type)) {
        errors.push(`${uploadedFile.type} is not supported`);
      }

      // this one is arbitrary
      if (uploadedFile.size > 100000) {
        errors.push('file size exceeded');
      }

      console.log(errors);

      if (_.size(errors) === 0) {
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
            searchText: '',
            images: images,
          });
          this.updateFilteredImages();
        }
      } else {
      }
    } finally {
      this.setState({
        loading: false,
        errors: errors,
      });
    }
  }

  searchTextChangeHandler = async (e) => {
    await this.setState({
      searchText: e.target.value,
    });
    this.updateFilteredImages();
  }

  updateFilteredImages = () => {
    const filterTextArray = this.state.searchText.split(' ');
    const filteredImages = [];

    _.forEach(this.state.images, (image) => {
      const imageText = image.public_id.toLowerCase();
      if (new RegExp(filterTextArray.join("|")).test(imageText)) {
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
    let errors = null

    if (_.size(this.state.errors) > 0) {
      errors = (
        <ul className="errors">
          {
            this.state.errors.map((error, index) => {
              return <li key={index}>
                {error}
              </li>
            })
          }
        </ul>
      )
    }

    return (
      <div className="app">
        <div className="action-row">
          <input
            type="text"
            placeholder="Search Images"
            value={ this.state.searchText }
            onChange={ this.searchTextChangeHandler }
          />
          <button
            disabled={ this.state.loading }
            onClick={ this.uploadButtonClickHandler }
          >
            Upload
          </button>
          <input
            type="file"
            ref={ this.hiddenFileInput }
            onChange={ this.handleChange }
            style={{ display: 'none' }}
          />
        </div>
        <div className="error-messages">
          {
            errors
          }
        </div>
        <div className="image-grid">
          {
            this.state.filteredImages.map((image, index) => {
              return <div
                className="image-wrapper"
                key={index}
              >
                <img 
                  className="uploaded-image"
                  src={image.url} 
                  alt={image.public_id}
                />
              </div>
            })
          }
        </div>
      </div>
    )
  }
}

export default App;
