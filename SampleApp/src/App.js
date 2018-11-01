import React, { Component } from 'react';
import AddressLookup from "address-lookup";
import './App.css';

class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      value: "",
      selectedAddress: "",
      selectedCity: "",
      selectedPostalCode: "",
      selectedProvince: "",
      selectedCountry: ""
    };
  }

  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    return (
        <div>{suggestion.addressText}</div>
      );
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onAddressSelected = (addressText, city, postalCode, province, country, addressID, selectionMethod) => {
    this.setState({
      value: [addressText, postalCode, province].join(", "),
      selectedAddress: addressText,
      selectedCity: city,
      selectedPostalCode: postalCode,
      selectedProvince: province,
      selectedCountry: country
    })
  }

  render() {
    const theme = {
      container:                'address-lookup__container',
      containerOpen:            'address-lookup__container--open',
      input:                    'address-lookup__input',
      inputOpen:                'address-lookup__input--open',
      inputFocused:             'address-lookup__input--focused',
      suggestionsContainer:     'address-lookup__suggestions-container',
      suggestionsContainerOpen: 'address-lookup__suggestions-container--open',
      suggestionsList:          'address-lookup__suggestions-list',
      suggestion:               'address-lookup__suggestion',
      suggestionFirst:          'address-lookup__suggestion--first',
      suggestionHighlighted:    'address-lookup__suggestion--highlighted',
      sectionContainer:         'address-lookup__section-container',
      sectionContainerFirst:    'address-lookup__section-container--first',
      sectionTitle:             'address-lookup__section-title'
    }
    
    return (
      <div className="App">
        <header className="App-header">
          <AddressLookup
            inputPlaceholder="Enter an address..." 
            renderSuggestion={this.renderSuggestion}
            onAddressSelected={this.onAddressSelected}
            language="ENG"
            value={this.state.value}
            onChange={this.onChange}
            theme={theme}
          />
        </header>
      </div>
    );
  }
}

export default App;
