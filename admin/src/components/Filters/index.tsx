import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Box} from '@strapi/design-system';
import {Filter} from '@strapi/icons';
import {FilterListURLQuery, FilterPopoverURLQuery} from '@strapi/helper-plugin';

const Filters = ({displayedFilters}: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef();

  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <>
      <Box paddingTop={1} paddingBottom={1}>
        <Button
          variant="tertiary"
          ref={buttonRef}
          startIcon={<Filter/>}
          onClick={handleToggle}
          size="S"
        >
          Filters
        </Button>
        {isVisible && (
          <FilterPopoverURLQuery
            displayedFilters={displayedFilters}
            isVisible={isVisible}
            onToggle={handleToggle}
            source={buttonRef}
          />
        )}
      </Box>
      <FilterListURLQuery filtersSchema={displayedFilters}/>
    </>
  );
};

Filters.propTypes = {
  displayedFilters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      metadatas: PropTypes.shape({label: PropTypes.string}),
      fieldSchema: PropTypes.shape({type: PropTypes.string}),
    })
  ).isRequired,
};

export default Filters;
