// Mock for @microsoft/sp-property-pane

// Property pane field types
const PropertyPaneFieldType = {
  Button: 0,
  CheckBox: 1,
  ChoiceGroup: 2,
  Dropdown: 3,
  Heading: 4,
  Label: 5,
  Link: 6,
  Slider: 7,
  Textbox: 8,
  Toggle: 9,
  Custom: 10
};

// Property pane button type
const PropertyPaneButtonType = {
  Normal: 0,
  Primary: 1,
  Hero: 2,
  Compound: 3,
  Command: 4,
  Icon: 5
};

// Text field factory function
function PropertyPaneTextField(targetProperty, properties = {}) {
  return {
    type: PropertyPaneFieldType.Textbox,
    targetProperty: targetProperty,
    properties: {
      label: properties.label || '',
      value: properties.value || '',
      placeholder: properties.placeholder || '',
      multiline: properties.multiline || false,
      resizable: properties.resizable || true,
      ...properties
    }
  };
}

// Dropdown factory function
function PropertyPaneDropdown(targetProperty, properties = {}) {
  return {
    type: PropertyPaneFieldType.Dropdown,
    targetProperty: targetProperty,
    properties: {
      label: properties.label || '',
      options: properties.options || [],
      selectedKey: properties.selectedKey,
      ...properties
    }
  };
}

// Toggle factory function
function PropertyPaneToggle(targetProperty, properties = {}) {
  return {
    type: PropertyPaneFieldType.Toggle,
    targetProperty: targetProperty,
    properties: {
      label: properties.label || '',
      onText: properties.onText || 'On',
      offText: properties.offText || 'Off',
      checked: properties.checked || false,
      ...properties
    }
  };
}

// Choice group factory function
function PropertyPaneChoiceGroup(targetProperty, properties = {}) {
  return {
    type: PropertyPaneFieldType.ChoiceGroup,
    targetProperty: targetProperty,
    properties: {
      label: properties.label || '',
      options: properties.options || [],
      ...properties
    }
  };
}

// Slider factory function
function PropertyPaneSlider(targetProperty, properties = {}) {
  return {
    type: PropertyPaneFieldType.Slider,
    targetProperty: targetProperty,
    properties: {
      label: properties.label || '',
      min: properties.min || 0,
      max: properties.max || 100,
      value: properties.value || 0,
      step: properties.step || 1,
      ...properties
    }
  };
}

// Button factory function
function PropertyPaneButton(targetProperty, properties = {}) {
  return {
    type: PropertyPaneFieldType.Button,
    targetProperty: targetProperty,
    properties: {
      text: properties.text || 'Button',
      buttonType: properties.buttonType || PropertyPaneButtonType.Normal,
      onClick: properties.onClick || (() => {}),
      ...properties
    }
  };
}

// Link factory function
function PropertyPaneLink(targetProperty, properties = {}) {
  return {
    type: PropertyPaneFieldType.Link,
    targetProperty: targetProperty,
    properties: {
      text: properties.text || 'Link',
      href: properties.href || '#',
      target: properties.target || '_blank',
      ...properties
    }
  };
}

// Configuration interfaces
const IPropertyPaneConfiguration = {
  pages: []
};

// Export everything
const spPropertyPane = {
  PropertyPaneFieldType,
  PropertyPaneButtonType,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneChoiceGroup,
  PropertyPaneSlider,
  PropertyPaneButton,
  PropertyPaneLink,
  IPropertyPaneConfiguration
};

module.exports = spPropertyPane;
module.exports.default = spPropertyPane;

// Named exports
module.exports.PropertyPaneFieldType = PropertyPaneFieldType;
module.exports.PropertyPaneButtonType = PropertyPaneButtonType;
module.exports.PropertyPaneTextField = PropertyPaneTextField;
module.exports.PropertyPaneDropdown = PropertyPaneDropdown;
module.exports.PropertyPaneToggle = PropertyPaneToggle;
module.exports.PropertyPaneChoiceGroup = PropertyPaneChoiceGroup;
module.exports.PropertyPaneSlider = PropertyPaneSlider;
module.exports.PropertyPaneButton = PropertyPaneButton;
module.exports.PropertyPaneLink = PropertyPaneLink;
module.exports.IPropertyPaneConfiguration = IPropertyPaneConfiguration;
