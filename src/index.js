import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import {
  AddressProvider, 
  ApiProviderEnum
} from 'address-service';
import { filter } from "lodash";

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

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionSelected = async (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    if (this.props.onAddressSelected){
      // Get the selected address information from the API
      const addressProvider = new AddressProvider().getProvider(ApiProviderEnum.CANADA_POST_API);
      const AddressDetails = await addressProvider.findAddressDetails({id: suggestion.id});
      // Make English the default language
      const selectedLanguage = this.props.language ? this.props.language : "ENG";
      const FilteredAddressDetails = filter(AddressDetails, { language: selectedLanguage });
      this.props.onAddressSelected(
        FilteredAddressDetails[0].streetAddress1,
        FilteredAddressDetails[0].city,
        FilteredAddressDetails[0].postalCode,
        FilteredAddressDetails[0].province,
        FilteredAddressDetails[0].country,
        FilteredAddressDetails[0].id,
        method
      );
    }
  }

  render() {
    const inputProps = {
      placeholder: this.props.inputPlaceholder,
      value: this.props.value,
      onChange: this.props.onChange
    };
    return (
      <div>
        <Autosuggest 
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.props.renderSuggestion ? this.props.renderSuggestion : this.renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={this.onSuggestionSelected}
          theme={this.props.theme} />
      </div>
    );
  }
}


export default AddressLookup;