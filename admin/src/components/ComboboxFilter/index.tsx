import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Combobox, ComboboxOption } from '@strapi/design-system';

const Index = ({ value, options, onChange }: any) => {
  const { formatMessage } = useIntl();
  const ariaLabel = formatMessage({
    id: 'Settings.permissions.auditLogs.filter.aria-label',
    defaultMessage: 'Search and select an option to filter',
  });

  return (
    <Combobox aria-label={ariaLabel} value={value} onChange={onChange}>
      {options.map(({ label, customValue }: any) => {
        return (
          <ComboboxOption key={customValue} value={customValue}>
            {label}
          </ComboboxOption>
        );
      })}
    </Combobox>
  );
};

Index.defaultProps = {
  value: null,
};

Index.propTypes = {
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      customValue: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Index;
