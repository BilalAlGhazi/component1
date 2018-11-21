import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import {
  AddressProvider, 
  AddressServiceProvider,
  ServiceProvider,
  LanguageCode,
  CountryCode
} from 'address-service';

class AddressLookup extends Component {
  
  constructor(props){
    super(props);
    let defaultLaguage = LanguageCode.English;
    if (this.props.language === "fr"){
      defaultLaguage = LanguageCode.French;
    }
    this.state = {
      suggestions: [],
      value: "",
      forceRenderSuggestions: false,
      nestedAddressID: "",
      language: defaultLaguage,
      renderSource: ""
    };
  }

  renderSuggestion = (suggestion) => {
    return (
        <div>
          <i style={{paddingRight: "5px"}} class="fas fa-map-marker-alt"></i>
          {suggestion.addressText}
        </div>
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
    // console.log("Fetching addresses", this.state.nestedAddressID);
    // Fetch value from Canada Post API
    const addressProvider = AddressServiceProvider.getAddressService(ServiceProvider.CanadaPostService)
    let AddressSearchList;
    if (this.state.nestedAddressID === ""){
      // New address search
      AddressSearchList = await addressProvider.findAddress({searchTerm: value, language: this.state.defaultLaguage, country: CountryCode.Canada});
    } else {
      // Nested address search
      AddressSearchList = await addressProvider.findNestedAddress({id: this.state.nestedAddressID, language: this.state.defaultLaguage, country: CountryCode.Canada});
    }
    
    this.setState({
      suggestions: AddressSearchList,
      value: (this.state.nestedAddressID === "") ? this.state.value : AddressSearchList[0].addressText,
      forceRenderSuggestions: (this.state.nestedAddressID === ""),
      renderSource: "onSuggestionsFetchRequested"
    });
  };

  onChange = (event, { newValue, method }) => {
    this.setState({
      nestedAddressID: "",
      forceRenderSuggestions: false,
      value: newValue,
      renderSource: "onChange"
    });
  };

  onSuggestionSelected = async (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    // console.log("Address selected", suggestion.isComplete);
    if(!suggestion.isComplete){
      // Selected address is not a complete address
      // Fetch the rest of the addresses
      this.setState({
        forceRenderSuggestions: true,
        nestedAddressID: suggestion.id,
        renderSource: "onSuggestionSelected"
      });
    }
    if (this.props.onAddressSelected){
      const addressProvider = AddressServiceProvider.getAddressService(ServiceProvider.CanadaPostService)
      if (suggestion.isComplete){
        // Selected address is a completed address
        // Get the selected address information from the API
        const AddressDetails = await addressProvider.findAddressDetails({id: suggestion.id, language: this.state.defaultLaguage});
        this.props.onAddressSelected(
          AddressDetails[0].streetAddress1,
          AddressDetails[0].city,
          AddressDetails[0].postalCode,
          AddressDetails[0].province,
          AddressDetails[0].country,
          AddressDetails[0].id,
          method
        );
      }
    }
  }

  render() {
    // console.log(this.state.renderSource);
    const inputProps = {
      placeholder: this.props.inputPlaceholder ? this.props.inputPlaceholder : "Enter an address...",
      value: this.state.value,
      onChange: this.onChange,
      onBlur: this.props.onBlur
    };
    const defaultTheme = {
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
      <div>
        <Autosuggest 
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.props.renderSuggestion ? this.props.renderSuggestion : this.renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={this.onSuggestionSelected}
          renderSuggestionsContainer={this.props.renderSuggestionsContainer}
          renderInputComponent={this.props.renderInputComponent}
          focusInputOnSuggestionClick={this.props.focusInputOnSuggestionClick}
          highlightFirstSuggestion={this.props.highlightFirstSuggestion}
          alwaysRenderSuggestions={this.props.alwaysRenderSuggestions || this.state.forceRenderSuggestions}
          focusInputOnSuggestionClick={true}
          onSuggestionHighlighted={this.props.onAddressHighlighted}
          theme={this.props.theme ? this.props.theme : defaultTheme} />
      </div>
    );
  }
}


export default AddressLookup;