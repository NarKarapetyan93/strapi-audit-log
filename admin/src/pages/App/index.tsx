/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, {Suspense, useEffect, useState} from 'react';
import { Switch, Route } from 'react-router-dom';
import {AnErrorOccurred, LoadingIndicatorPage, useQueryParams} from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import HomePage from '../HomePage';

const App = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [{ rawQuery }, setQuery] = useQueryParams();

  useEffect(() => {
    setQuery({ page: 1, pageSize: 10 });
    setIsLoading(false);
  }, [isLoading])

  return (
    <div>
      {isLoading && <LoadingIndicatorPage />}
      {rawQuery ? (
        <Suspense fallback={<LoadingIndicatorPage />}>
          <Switch>
            <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
            <Route component={AnErrorOccurred} />
          </Switch>
        </Suspense>
      ): null}
    </div>
  );
};

export default App;
