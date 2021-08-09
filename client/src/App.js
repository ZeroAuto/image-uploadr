import './App.css';
import axios from 'axios';
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
    }
  }

  uploadButtonClickHandler = () => {
    this.hiddenFileInput.current.click();
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

  render() {
    return (
      <div className="app">
        <button onClick={ this.uploadButtonClickHandler }>Upload</button>
        <input
          type="file"
          ref={ this.hiddenFileInput }
          onChange={ this.handleChange }
          style={{ display: 'none' }}
        />
        {
          this.state.images.map((image, index) => {
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
