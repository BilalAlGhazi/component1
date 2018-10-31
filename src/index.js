import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import {
  AddressProvider, 
  ApiProviderEnum
} from 'address-service';

class AddressLookup extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      suggestions: [],
      value: ""
    };
  }

  renderSuggestion = (suggestion) => {
    return (
        <div>{suggestion.addressText}</div>
      );
  }

  getSuggestionValue = (suggestion) => {
    return suggestion.addressText;
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionsFetchRequested = async ({ value }) => {
    // Fetch value from Canada Post API
    const addressProvider = new AddressProvider().getProvider(ApiProviderEnum.CANADA_POST_API);
    const AddressSearchList = await addressProvider.findAddress({searchTerm: value, country: "CANADA"});

    this.setState({
      suggestions: AddressSearchList
    });
  };

  escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getSuggestions = (value) => {
    const escapedValue = this.escapeRegexCharacters(value.trim());
    
    if (escapedValue === '') {
      return [];
    }
  
    const regex = new RegExp('^' + escapedValue, 'i');
  
    return languages.filter(language => regex.test(language.name));
  }

  escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // inputProps = {
  //   placeholder: "Type 'c'",
  //   value: this.state.value,
  //   onChange: this.onChange
  // };

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  render() {
    const inputProps = {
      placeholder: this.props.inputPlaceholder,
      value: this.state.value,
      onChange: this.onChange
    };
    return (
      <div>
        <Autosuggest 
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps} />
      </div>
    );
  }
}


export default AddressLookup;